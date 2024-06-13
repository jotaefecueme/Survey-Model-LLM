import requests
import json
import os
import subprocess
import time

def start_ngrok(port):
    try:
        # Comprueba si Ngrok ya está en ejecución
        response = requests.get('http://127.0.0.1:4040/api/tunnels')
        data = response.json()
        public_url = data['tunnels'][0]['public_url']
        print(f"Ngrok ya está en ejecución en {public_url}")
        return public_url
    except Exception as e:
        print(f"Ngrok no está en ejecución. Iniciando Ngrok en el puerto {port}...")
        subprocess.Popen(['ngrok', 'http', str(port)])
        time.sleep(5)  # Espera unos segundos para asegurarte de que Ngrok está completamente iniciado
        response = requests.get('http://127.0.0.1:4040/api/tunnels')
        data = response.json()
        public_url = data['tunnels'][0]['public_url']
        print(f"Ngrok iniciado correctamente en {public_url}")
        return public_url

def update_ngrok_url():
    try:
        public_url = start_ngrok(1024)  # Cambia el puerto aquí si es necesario

        # Actualiza config.json con la nueva URL de Ngrok
        config_data = {
            "ngrok_url": public_url
        }

        with open('config.json', 'w') as config_file:
            json.dump(config_data, config_file, indent=4)

        print(f"Actualizado config.json con la URL: {public_url}")

        # Ejecuta comandos de git para añadir, hacer commit y hacer push
        os.system("git add config.json")
        os.system("git commit -m 'Actualizar URL de Ngrok'")
        os.system("git push origin main")

        print("Commit y push realizados exitosamente.")
    except Exception as e:
        print(f"Error actualizando config.json o haciendo commit/push: {e}")

if __name__ == "__main__":
    update_ngrok_url()
