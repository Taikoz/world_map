from django.contrib import admin
from unfold.admin import ModelAdmin
from api.models.spatial_type import SpatialType

@admin.register(SpatialType)
class SpatialAdmin(ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    