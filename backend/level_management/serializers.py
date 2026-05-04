from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
 
from level_management.models import Level, LevelCompletion

from django.db.models import Prefetch

class LevelSerializer(ModelSerializer):
 
    class Meta:
        model = Level
        fields = ['id', 'name', 'lvData', 'position']
    


# Note : Credits ici pour l'extension de serializer : https://stackoverflow.com/questions/49900629/django-serializer-inherit-and-extend-fields
class LevelMainQuestSerializer(LevelSerializer):
    completionStatus = serializers.SerializerMethodField()

    def get_completionStatus(self, obj):
        user = self.context["request"].user

        completion = obj.completions.filter(user=user).first() # Note : pourquoi "obj.completions" ? Parce que dans LevelCompletions, il y a 'related_name = "completions"'

        if completion:
            return completion.status

        return None

    class Meta(LevelSerializer.Meta):
        fields = LevelSerializer.Meta.fields + ['completionStatus']