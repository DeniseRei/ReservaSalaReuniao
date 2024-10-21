# Nome do Projeto

Descreva brevemente o que é o projeto e seu objetivo.

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- PHP 8.1 ou superior
- Composer
- PostgreSQL
- DBeaver (ou outro cliente SQL para gerenciar o banco de dados)

## Instalação

Siga os passos abaixo para instalar o projeto:

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu_usuario/seu_repositorio.git
   cd seu_repositorio

composer install
cp .env.example .env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:+U1x2taVadFor/+IbSxPIVr3U4qCySptYEGjPkD7yQQ=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reserva_salas_db
DB_USERNAME=root
DB_PASSWORD=root

...
php artisan key:generate

php artisan migrate

php artisan serve

http://localhost:8000
