import requests
from config import TIMEOUT

def send_get_request(url, params=None):
    try:
        res = requests.get(url, params=params, timeout=TIMEOUT)
        return res
    except:
        return None

def send_post_request(url, data=None):
    try:
        res = requests.post(url, data=data, timeout=TIMEOUT)
        return res
    except:
        return None