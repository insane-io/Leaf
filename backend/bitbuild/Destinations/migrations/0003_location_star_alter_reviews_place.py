# Generated by Django 5.1.2 on 2024-10-19 17:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Destinations', '0002_reviews'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='star',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='reviews',
            name='place',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='Destinations.location'),
        ),
    ]
