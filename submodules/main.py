from __future__ import print_function

import io
import PIL.Image
import PIL.ImageDraw

import os
import dotenv
from api.py.api_service import APIService
from api.py.google_credentials import GoogleCredentials
dotenv.load_dotenv()

SERVICE_ACCOUNT_INFO = os.environ.get('SERVICE_ACCOUNT_INFO')
API_SERVICE_NAME = 'drive'
API_VERSION = 'v3'


def main():
    credentials = GoogleCredentials.from_service_account(SERVICE_ACCOUNT_INFO)
    drive_service = APIService(service_name=API_SERVICE_NAME,
                               api_version=API_VERSION, google_credentials=credentials)

    response = drive_service.service().files().list(
        q="mimeType = 'application/vnd.google-apps.folder' and name != 'GUIAS'",
        pageSize=10).execute()

    folders = (response.get('files', []))
    folders = sorted(folders, key=lambda k: k['name'])
    for folder in folders:
        folder_name = folder.get('name')

        os.makedirs(f'./dist/assets', exist_ok=True)
        os.makedirs(f'./dist/assets/{folder_name}', exist_ok=True)
        print(folder_name, "created")

        folder_id = folder.get('id')
        response = drive_service.service().files().list(q=f"'{folder_id}' in parents").execute()
        files = response.get('files', [])
        files = sorted(files, key=lambda k: k['name'])
        for file in files:
            media = drive_service.service().files().get_media(fileId=file.get('id')).execute()
            image = PIL.Image.open(io.BytesIO(media))
            image.save(f'./dist/assets/{folder_name}/{file.get("name")}')
            print("\t", file.get('name'), "created")

    # with open('items.json', 'w') as file:
    #     json.dump(files, file, indent=4, sort_keys=True, ensure_ascii=False)


main()
