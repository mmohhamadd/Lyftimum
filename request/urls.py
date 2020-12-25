from django.urls import path
from . import views

urlpatterns = [
    path('', views.MakeRequestView.as_view())
]