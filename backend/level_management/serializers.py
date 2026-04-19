from rest_framework.serializers import ModelSerializer
 
from level_management.models import Level
 
class LevelSerializer(ModelSerializer):
 
    class Meta:
        model = Level
        fields = ['id', 'name', 'data', 'position']