import requests
import re
from bs4 import BeautifulSoup

headers = {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,es;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    "cookie": "l=v1; _fbp=fb.1.1661623719380.458283544; acceptcookies=true; _ga_FWY5Q9GFZ5=GS1.1.1662991865.1.1.1662992709.0.0.0; _ce.s=v~33546291c65fa9d33ecc384abd4a72649452b18e~vpv~3; _ga_F5XZ540Q4V=GS1.1.1663806872.8.1.1663808654.60.0.0; _ga_WKTGWY6RV1=GS1.1.1663806872.8.1.1663808654.0.0.0; _ga_F7KSNTXTRX=GS1.1.1663806872.8.1.1663808654.0.0.0; _ga_9GDD7JMVB9=GS1.1.1664034990.1.1.1664035737.0.0.0; _ga_Z06YPREY6C=GS1.1.1664134778.2.0.1664134778.0.0.0; _ga_HSLJ40C58F=GS1.1.1667058917.1.0.1667058927.0.0.0; _ga_QZLLBWY8HJ=GS1.1.1667058937.1.1.1667060481.0.0.0; _ga_72Q885H61S=GS1.1.1669318470.1.1.1669318484.0.0.0; _uetvid=c18295b0b16711ecb53fb91ebe8e168c; _hjSessionUser_1709057=eyJpZCI6ImVjOTEyZmJkLWJjZTYtNTJlNC1iNTRkLWMxNzVlM2JkZWFiZSIsImNyZWF0ZWQiOjE2NzEyMjQ5NDQ3MDEsImV4aXN0aW5nIjp0cnVlfQ==; _ga_4Q2ZJ2TF9M=GS1.1.1673982510.1.1.1673983719.0.0.0; _ga_7M502FZHLM=GS1.1.1674409554.4.0.1674409554.0.0.0; _ga_8WGMG03SYF=GS1.1.1676414539.1.1.1676414659.0.0.0; _ga_NBSWGHESJK=GS1.1.1678247531.1.1.1678247969.0.0.0; _ga_W1FN9Y1DXK=GS1.1.1678817027.2.0.1678817027.0.0.0; _clck=jfs2p3|1|f9y|0; _ga_CE06TWK3H2=GS1.1.1678977808.3.0.1678977827.0.0.0; _ga_03SJNLDL5S=GS1.1.1678977832.10.1.1678977835.57.0.0; _ga_CTWHCHTFE2=GS1.1.1679184169.2.0.1679184169.0.0.0; _ga_WHKL7R2DZZ=GS1.1.1680804406.27.0.1680804406.60.0.0; _ga_40DXBV0KDT=GS1.1.1680829363.1.1.1680829662.0.0.0; _ga_XQ8EDNE6RK=GS1.1.1682352063.9.1.1682352076.0.0.0; _ga_JQDSE1YPEX=GS1.1.1683725160.158.0.1683725162.0.0.0; _ga_80VDTXHB7F=GS1.1.1685733149.24.1.1685733160.0.0.0; _ga_9H2P504YR1=GS1.1.1685797598.35.1.1685799619.0.0.0; _ga_C314QG7LHT=GS1.1.1686338779.2.1.1686338794.0.0.0; _gid=GA1.2.165527068.1686541751; affiliation_verified_customer_id=546; disambiguate_customer_id=546; WEBSERVER=2; squid_events=on; mwtbid=3021261A-3D32-4104-A260-545130332D8E; mwtses=asp01; OptanonAlertBoxClosed=2023-06-12T03:59:36.566Z; previous-captions-state=1; _ga_D0LVE2B9S5=deleted; symbol_informations_by_search_layer={%22https://search-alexanderstreet-com.myaccess.library.utoronto.ca/cart%22:%22store%22%2C%22https://search-alexanderstreet-com.myaccess.library.utoronto.ca/%22:%22all%22}; _ga_J39CWY3078=GS1.1.1686585138.5.1.1686585157.0.0.0; _ga_D0LVE2B9S5=GS1.1.1686585157.3.1.1686585159.0.0.0; ezproxy=cUluvAalJ5svjAr; mwtsid=FA3494E2-BD6B-43E7-A9DF-308D21C5B272; _gat_UA-11339397-31=1; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jun+12+2023+11%3A54%3A12+GMT-0400+(Eastern+Daylight+Time)&version=202303.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=7afa53cf-5b8b-448d-b2d9-85c4aeda58f8&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1%2CC0002%3A1&geolocation=CA%3BON&AwaitingReconsent=false; _ga=GA1.1.72252927.1663010800; _ga_39XMLGGY9Q=GS1.1.1686585199.3.1.1686585255.0.0.0"
    }
# Make a request and get the response
response = requests.get("https://search-alexanderstreet-com.myaccess.library.utoronto.ca/view/work/bibliographic_entity%7Cbibliographic_details%7C2086471", headers=headers)
print(response.status_code)
# Parse the HTML content
soup = BeautifulSoup(response.content, 'lxml')

#print(soup.text)
# Find the <script> tag containing jQuery.extend(Drupal.settings)
script_tag = soup.find('script', text=lambda text: text and 'jQuery.extend(Drupal.settings' in text)

# Extract the contents of the <script> tag
script_content = script_tag.string
def extract_transcript(drupal_document):
    pattern = r"BEGIN TRANSCRIPT([\s\S]*?)END TRANSCRIPT"
    matches = re.findall(pattern, drupal_document, re.DOTALL)
    return matches

writeFile = open("test.txt", "w")
writeFile.write(script_content)
writeFile.close()

# Print the extracted JavaScript code
print(script_content)