from rest_framework.views import APIView
from rest_framework.response import Response
import requests 
  
snapp_token = 'Bearer eyJhbGciOiJSUzUxMiIsImtpZCI6Ino4YTRsNG9PRkVxZ2VoUllEQlpQK2ZwclBuTERMbWFia3NsT3hWVnBMTkUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsicGFzc2VuZ2VyIl0sImVtYWlsIjoibW1vaGhhbWFkZEBnbWFpbC5jb20iLCJleHAiOjE2MTAwOTY4ODMsImlhdCI6MTYwODg4NzI4MywiaXNzIjoxLCJqdGkiOiJzY2dXQTBhUUVldUpyd0lBckJCTTVZK210ZjRMQVVxcGlQQzRJMmxWWDN3Iiwic2lkIjoiMWxUaDJxMEw5RUk5N29rblhCTFFlMDFJTFpVIiwic3ViIjoiem9CSzJOSnl5TzJtOHlZIn0.qEbqt-WLTnx8VtNGCVh9C0xtMvbyKeIgkLZsE0wCYQN1ikwYLbTZCokwtw4VqRUnH2cEyhLEADvZzBMpB-T_R9utuGGRf3drZdAWLhebbTO_8dOUVMd3WipIeubY9UxSQptPsGBpirzVmzjUMoMMZRYOO-QbMs03yVhziZnAB8HwBz05drYDy14pfwZb61JgOtXQxVanoScjQcup3JAiI8ZVh9-j88EbaQVEqloBFyGPsUnhqKdp71nlM5fzq87oaW0x5Ks_DNsy9IqkDtObbw0FeODnFDQlE_IMYlNDz6lfeij89Bb6o2sxShAgRFAjTRavxB21VIIpmTlpeX57MBXyinkgK0xL8qy99Nu6uUZiwjpZMIPc5Tvxqiq3_4OkQzz_cWevMaGz8iGEP7xdzhotGVTrMdNnXKAtsjnYvioLmtwulWJZQ0QmGo7F-eQcae2SH2o5XO12_cIlpzKqtA9pxE30vmRcvLF0FSIqxjswvsigIxfTvKPpxdkAWZERJN-bjMUN8xPtyi6QB0u5tpAlYWXlq11w15lQuI0IBIe4ETC1mTVkagzTDnQGlOdAs_QENAURSKOZfQZu9-lLqOQw0Z9jL4RJzw2OyGFwCFpvFS7KK8N8sci0QDctyoZKgKjreovHlK80k7lEPT7-ZlXHT-sGg4hswSw0Gjbu72g'
snapp_url = 'https://app.snapp.taxi/api/api-base/v2/passenger/price/s/6/0'

tapsi_token = ' eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1OTAwNzYsInJvbGUiOiJQQVNTRU5HRVIiLCJjaXR5IjoiVEVIUkFOIn0sImlhdCI6MTYwNTMxMDg4NiwiYXVkIjoiZG9yb3Noa2U6YXBwIiwiaXNzIjoiZG9yb3Noa2U6c2VydmVyIiwic3ViIjoiZG9yb3Noa2U6dG9rZW4ifQ.N8MIJEEoEnoXb7jr7AReONJyR73mLd4Wq1bhr7cYEgrxMMVOYRTPop0vRbJ-FSiUKlWWATwCGmIthVzm3ktEdw'
tapsi_url = 'https://tap33.me/api/v2.3/ride/preview'

alopk_token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiMTQ0MjM0NDFfZGFzaGJvYXJkX3B3YV9jaHJvbWUtODYuMC40MjQwLjE5OCIsInN1YiI6MTQ0MjM0NDEsImlzcyI6Imh0dHBzOi8vYXBpLmFsb3BleWsuY29tL2FwaS92MiIsImlhdCI6MTYwNTQyMjUzMCwiZXhwIjo1MjA1NDIyNTMwLCJuYmYiOjE2MDU0MjI1MzAsImp0aSI6IjFrdXJBTHNZWWtESXJmbWwifQ.18j39mFKpNfIk-yjuPSPPwVHg6hsB5PYIaXg_M_odHY'
alopk_url = 'https://api.alopeyk.com/api/v2/orders/price/calc'
class MakeRequestView(APIView):
    def post(self,request):
        org_lat = request.data['org_lat']
        org_lng = request.data['org_lng']
        des_lat = request.data['des_lat']
        des_lng = request.data['des_lng']
        prices = {'snapp':[], 'tapsi':[] }
      
        snapp = requests.post(url=snapp_url,
                              headers={'authorization':snapp_token},
                              json = {"origin_lat":org_lat,
                                     "origin_lng":org_lng,
                                     "destination_lat":des_lat,
                                     "destination_lng":des_lng})

        tapsi = requests.post(url=tapsi_url,
                              headers={'x-authorization':tapsi_token,
                                      'content-type':'application/json'} , 
                              json ={"origin":{"latitude":float(org_lat),
                                                "longitude":float(org_lng)},
                                    "destinations":[{"latitude":float(des_lat),"longitude":float(des_lng)}]})
        
        alopk_car = requests.post(url=alopk_url,
                              headers={'Authorization':alopk_token,
                                      'content-type':'application/json'},
                              json ={"addresses":[{"lat":org_lat,"lng":org_lng,"type":"origin"},
                                                  {"lat":des_lat,"lng":des_lng,"type":"destination"}],
                                                   "transport_type":"car"})

        alopk_motortaxi = requests.post(url=alopk_url,
                              headers={'Authorization':alopk_token,
                                      'content-type':'application/json'},
                              json ={"addresses":[{"lat":org_lat,"lng":org_lng,"type":"origin"},
                                                  {"lat":des_lat,"lng":des_lng,"type":"destination"}],
                                                   "transport_type":"motor_taxi"})
        alopk_motorbike = requests.post(url=alopk_url,
                              headers={'Authorization':alopk_token,
                                      'content-type':'application/json'},
                              json ={"addresses":[{"lat":org_lat,"lng":org_lng,"type":"origin"},
                                                  {"lat":des_lat,"lng":des_lng,"type":"destination"}],
                                                   "transport_type":"motorbike"})
        
        
        for a in range(4):
            prices['snapp'].append( int(snapp.json()['data']['prices'][a]['final']/10) )
        prices['tapsi'].append(tapsi.json()['data']['categories'][1]['services'][0]['prices'][0]['passengerShare'])
        prices['tapsi'].append(tapsi.json()['data']['categories'][2]['services'][0]['prices'][0]['passengerShare'])
        

        return Response({
            'Snapp':{'Eco':prices['snapp'][0],
                     'Plus':prices['snapp'][1],
                     'Box':prices['snapp'][2],
                     'Bike':prices['snapp'][3]},
            'Tapsi':{'Classic':prices['tapsi'][0],
                     'Delivery':prices['tapsi'][1]}
            #'alopk_motortaxi':alopk_motortaxi.json()['status'],
            #'alopk_motorbike':alopk_motorbike.json()['status'],
            #'alopk_car':alopk_car.json()['status']



        })
