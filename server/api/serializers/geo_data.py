from rest_framework_gis.serializers import GeoFeatureModelSerializer
from api.models.geometry_data import GeoData

class GeoDataGeoJsonSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = GeoData
        geo_field = "geom"
        fields = ('id', 'name', 'type', 'properties',)
        read_only_fields = ('embedding', 'created_at')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        props = rep.get('properties', {})
        nested_props = props.pop('properties', {}) or {}
        # Merge nested properties into the main properties dict
        props.update(nested_props)
        rep['properties'] = props
        return rep