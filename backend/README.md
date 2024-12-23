# Sistema de Reservas de Salas de Reunião

Este projeto é um sistema de reservas de salas de reunião, permitindo que os usuários visualizem a disponibilidade das salas, realizem reservas e editem ou cancelem suas próprias reservas.

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- PHP 8.1 ou superior
- Composer
- PostgreSQL
- DBeaver (ou outro cliente SQL para gerenciar o banco de dados)

Para mais informações sobre as versões específicas dos pré-requisitos de instalação, consulte o [relatório de teste](backend/public/relatorios/relatorio_teste_sistema_salas_reservas.pdf).

## Instalação

Siga os passos abaixo para instalar o projeto backend:

1. **Clone o repositório**

   ```bash
   git clone https://github.com/DeniseRei/ReservaSalaReuniao.git
   
cd ReservaSalaReuniao/backend
composer install
cp .env.example .env

APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:+U1x2taVadFor/+IbSxPIVr3U4qCySptYEGjPkD7yQQ=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reserva_salas_db
DB_USERNAME=root
DB_PASSWORD=root

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"


php artisan key:generate

php artisan migrate

php artisan serve

A API estará disponível em: http://localhost:8000

CREATE DATABASE reserva_salas_db;

