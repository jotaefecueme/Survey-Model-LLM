import requests
import json
import os

def update_ngrok_url():
    try:
        # Obtener la URL pública de Ngrok
        response = requests.get('http://127.0.0.1:4040/api/tunnels')
        data = response.json()
        public_url = data['tunnels'][0]['public_url']

        # Crear un diccionario con la URL de Ngrok
        config_data = {
            "ngrok_url": public_url
        }

        # Escribir la URL de Ngrok en el archivo config.json
        with open('config.json', 'w') as config_file:
            json.dump(config_data, config_file, indent=4)

        print(f"Updated config.json with URL: {public_url}")
    except Exception as e:
        print(f"Error updating config.json: {e}")

if __name__ == "__main__":
    update_ngrok_url()
    # Hacer commit y push a GitHub
    os.system("git add config.json")
    os.system("git commit -m 'Update ngrok URL'")
    os.system("git push origin main")
