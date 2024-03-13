# VinoVault
Se trata de un sistema de stock para vinos. El sistema está contruido con Ionic React Capacitor, por tanto es capaz de ejecutarse en web, así como también en Android y IOS (en esta situación descartado a causa de qué muchos ajustes son de pago).
Está construido de manera separada, es decir, la aplicación, y el servidor.
El servidor posee sistema de login, buscador de productos por códigos de barra, acceso a base de datos (Cassandra), y nuestra base de datos dispone de permisos que vamos a ir configurando poco a poco.
La aplicación es capaz de consumir estos servicios mencionados.
Es necesario tener instalado **NodeJS** y **Android Studio**, éste último, solamente lo utilizaremos para poder utilizar sus SDK, ya que estos se configuran automaticamente y no tendremos que hacerlo de manera manual.
## Para Comenzar
### Requerimientos
#### Para la base de datos Cassandra
Dado que las versiones más actualizadas y estables de Cassandra están solamente disponibles para sistemas operativos Linux, esto no nos limita ya que a partir de *Windows 10 para arriba* se puede utilizar **WSL (Windows Subsystem for Linux)** lo cuál nos permite utilizar programas para Linux, en un entorno de comandos en nuestro Windows, pero necesita una serie de pasos importantes para habilitarlo y usarlo sin que nos provoque muchos problemas.
Empezamos con **Windows PowerShell** con **permisos de administrador** y poner los siguientes comandos si WSL no está instalado en absoluto:
```PowerShell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```
Luego de que se completen los procesos de ambos comandos, **reiniciar su computador**, e instalar el kernel actualizado de windows x64 aquí -> [WSL Kernel](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi).
Una vez instalado, ejecutar con permisos de administrador el siguiente comando:
```PowerShell
wsl --set-default-version 2
```
Luego solamente es necesario descargar una distribución de Linux, en mi caso voy por la versión más típica que es Ubuntu, que se descargará directamente al usar el comando:
```PowerShell
wsl --install
```
Si hay algún error, o no inicia una descarga, usar:
```PowerShell
wsl --install -d ubuntu
```
Una vez instalada puede que inicie directamente el subsistema, si no es el caso, usar:
```PowerShell
ubuntu
```
Alli te pedirá que configures tus datos para inicio de sesión, usuarios, etc. Completalo y procederemos a la instalación de ***JAVA y Cassandra*** desde el subsistema.
Empezamos con **JAVA** queremos la OpenJDK 11, este no pertenece a Oracle, por ende nos ahorramos problemas.
Escriba los comandos uno por uno:
```bash
wget https://builds.openlogic.com/downloadJDK/openlogic-openjdk/11.0.22+7/openlogic-openjdk-11.0.22+7-linux-x64.tar.gz
tar -xf openlogic-openjdk-11.0.22+7-linux-x64.tar.gz
```
El siguiente comando puede que falle porque en algunos entornos ya está creado por defecto, permite crear una carpeta:
```bash
sudo mkdir /usr/lib/jvm
```
Continuamos uno por uno:
```bash
sudo mv openlogic-openjdk-11.0.22+7-linux-x64 /usr/lib/jvm
echo 'export PATH=$PATH:/usr/lib/jvm/openlogic-openjdk-11.0.22+7-linux-x64/bin' >> ~/.bashrc
source ~/.bashrc
```
Ahora, solamente toca probar si es que el java fue instalado correctamente:
```bash
java -version
```
Si todo salió bien, continuamos ahora con Cassandra, cada comando, uno por uno:
```bash
wget https://dlcdn.apache.org/cassandra/4.0.12/apache-cassandra-4.0.12-bin.tar.gz
tar -xzvf apache-cassandra-4.0.12-bin.tar.gz
sudo mv apache-cassandra-4.0.12 /opt/
echo 'export PATH=$PATH:/opt/apache-cassandra-4.0.12/bin' >> ~/.bashrc
source ~/.bashrc
```
Una vez hecho todo esto, ingresar el siguiente comando que permitirá a Cassandra alterar sus propios datos, ya que es bastante dinámico, requiere permisos especiales, no como otras bases de datos:
```bash
sudo chmod -R 777 /opt/apache-cassandra-4.0.12
```
Ahora solo toca eliminar los archivos comprimidos para liberar espacio, uno por uno, esto es opcional:
```bash
sudo rm openlogic-openjdk-11.0.22+7-linux-x64.tar.gz
sudo rm apache-cassandra-4.0.12-bin.tar.gz
```
Con esto ya está todo listo para iniciar Cassandra con solo poner:
```bash
cassandra -f
```
Dejar abierto la otra consola por unos minutos y entrar en otra terminal de **PowerShell** sin cerrar la anterior, ponemos uno por uno:
```PowerShell
ubuntu
cqlsh
```
Allí nos saldrá una salida similar a esta:
```bash
Connected to Test Cluster at 127.0.0.1:9042
[cqlsh 6.0.0 | Cassandra 4.0.12 | CQL spec 3.4.5 | Native protocol v5]
Use HELP for help.
```
Comenzando ya con la creación de la base de datos, usamos el siguiente comando:
```cql
CREATE KEYSPACE IF NOT EXISTS stocks_vinos
WITH replication = {
  'class': 'SimpleStrategy', -- Este está configurado solo para pruebas, si fuera un caso real, debería de ser NetworkTopologyStrategy en lugar de SimpleStrategy, de tal forma podriamos hacer sistemas distribuidos.
  'replication_factor': 1 -- Acá el numero mayor a 1, para poder tener un backup de datos y el alcance sea mayor.
};
```
Para usar la keyspace:
```cql
USE stock_vinos;
```
Creamos las tablas para la base de datos:
```cql
CREATE TABLE productos (
	ean TEXT PRIMARY KEY,
	nombre_producto TEXT,
	marca TEXT,
	descripcion TEXT,
	precio INT,
	cantidad INT
	
) WITH compression = {'sstable_compression': 'LZ4Compressor'}; 
-- La compresión LZ4Compressor nos permite comprimir los datos y bajar el peso en disco duro, su descompresión es más rápida.
CREATE TABLE productos_temps (
	ean TEXT PRIMARY KEY,
	nombre_producto TEXT,
	marca TEXT,
	descripcion TEXT,
	imagen TEXT
	
) WITH compression = {'sstable_compression': 'DeflateCompressor'}
-- La compresión DeflateCompressor nos permite comprimir los datos y bajar el peso aún más en disco duro, su descompresión es más lenta ya que comprime en ZIP.
AND default_time_to_live = 259200; -- Tiempo de vida, borra el elemento agregado cuando pasa el tiempo configurado.
CREATE TABLE IF NOT EXISTS usuarios (
    usuario text PRIMARY KEY,
    creado boolean,
    clave text
) WITH compression = {'sstable_compression': 'LZ4Compressor'}; 
```
Para poder salir de Cqlsh:
```bash
exit
```
**Cerramos la terminal con Cassandra activo** y para poder activar la autenticación por contraseña seguir los pasos de este video [A partir del minuto 2 hasta el 3:02, y solamente modificar esa parte](https://www.youtube.com/watch?v=MN5q3LcGo0I), (que grandes son los Indios XD), solamente que con nuestra ruta que es
``
/opt/apache-cassandra-4.0.12
``
Volvemos a activar una terminal con 
`` 
cassandra -f
``
pero en otra lo haremos con:
```bash
cqlsh -u cassandra -p cassandra
```
Si lo hacemos sin
``
-u cassandra -p cassandra
``
ya no va a funcionar.
#### Para la aplicación
Antes que nada para evitar problemas abrir *Windows PowerShell* con **permisos de administrador** y poner el siguiente comando que evitará darnos problemas con comandos NodeJS en el futuro:
```PowerShell
Set-ExecutionPolicy Unrestricted
```
Después de esto, con el **PowerShell** abierto y con sus respectivos permisos, usamos este comando de instalación y esperamos:
```PowerShell
npm install -g @ionic/cli
```
