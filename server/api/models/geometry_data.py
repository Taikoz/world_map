import uuid
from django.contrib.gis.db import models
from pgvector.django import VectorField
from api.models.spatial_type import SpatialType
from api.utils.compute import compute_embedding_from_geom

class GeoData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.ForeignKey(SpatialType, on_delete=models.CASCADE)
    geom = models.GeometryField()
    embedding = VectorField(dimensions=1536)
    properties = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.embedding is None:
            self.embedding = compute_embedding_from_geom(self.geom)
        super().save(*args, **kwargs)
