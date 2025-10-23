from rest_framework import viewsets

from api.models.geometry_data import GeoData
from api.serializers.geo_data import GeoDataGeoJsonSerializer



class GeoDataViewSet(viewsets.ModelViewSet):
    queryset = GeoData.objects.all()
    serializer_class = GeoDataGeoJsonSerializer
