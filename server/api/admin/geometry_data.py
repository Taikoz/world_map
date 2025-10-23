from django import forms
from django.contrib.gis.admin import GISModelAdmin
from django.forms import JSONField
from unfold.admin import ModelAdmin
from django.contrib import admin
from api.models import GeoData
from leaflet.admin import LeafletGeoAdmin
import json 

class PrettyJSONEncoder(json.JSONEncoder):
    def __init__(self, *args, indent, sort_keys, **kwargs):
        super().__init__(*args, indent=4, sort_keys=True, **kwargs)

# Custom form: only override the widget for JSONField
class GeoDataAdminForm(forms.ModelForm):
    class Meta:
        model = GeoData
        fields = '__all__'
        widgets = {
            # Use a plain Textarea for the JSONField
            JSONField: forms.Textarea(attrs={'rows': 5, 'cols': 40}),
        }

@admin.register(GeoData)
class GeoDataAdmin(ModelAdmin, LeafletGeoAdmin):
    form = GeoDataAdminForm
    
    num_zoom = 20
    max_extent = '-20037508,-20037508,20037508,20037508'
    max_resolution = '156543.0339'
    point_zoom = num_zoom - 6
    units = 'm'

    list_display = ('name', 'type', 'created_at')
    search_fields = ('name',)
    list_filter = ('type', 'created_at')
    readonly_fields = ('embedding', 'created_at')
    fields = ('name', 'type', 'geom', 'properties', 'created_at')
