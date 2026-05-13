from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
 
from level_management.models import Level
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthorSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class LevelSerializer(ModelSerializer): 

    class Meta:
        model = Level
        fields = ['id', 'name', 'lvData', 'position']

# Pour une certaine raison, simplement ajouter "creator" dans l'ancien serializer et le réutiliser... le rend incohérent. Pour les requêtes en update, tout cas.
# Qu'à cela ne tienne, je crée un nouveau serializer...
class LevelWithAuthorSerializer(ModelSerializer): 

    creator = AuthorSerializer()  # Note : details ici : https://medium.com/@moustafa.alhaiba.2003/mastering-django-rest-framework-serializers-from-basics-to-best-practices-59dc93438eee
    class Meta:
        model = Level
        fields = ['id', 'name', 'lvData', 'position', 'creator']

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