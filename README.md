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
Luego de que se completen los procesos de ambos comandos, reiniciar su computador, e instalar el kernel actualizado de windows x64 aquí -> [WSL Kernel](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi).
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
```linux
wget https://builds.openlogic.com/downloadJDK/openlogic-openjdk/11.0.22+7/openlogic-openjdk-11.0.22+7-linux-x64.tar.gz
tar -xf openlogic-openjdk-11.0.22+7-linux-x64.tar.gz
```
El siguiente comando puede que falle porque en algunos entornos ya está creado por defecto, permite crear una carpeta:
```linux
sudo mkdir /usr/lib/jvm
```
Continuamos uno por uno:
```linux
sudo mv openlogic-openjdk-11.0.22+7-linux-x64 /usr/lib/jvm
echo 'export PATH=$PATH:/usr/lib/jvm/openlogic-openjdk-11.0.22+7-linux-x64/bin' >> ~/.bashrc
source ~/.bashrc
```
Ahora, solamente toca probar si es que el java fue instalado correctamente:
```linux
java -v
```
Si todo salió bien, continuamos ahora con Cassandra, cada comando, uno por uno:
```linux
wget https://dlcdn.apache.org/cassandra/4.0.12/apache-cassandra-4.0.12-bin.tar.gz
tar -xzvf apache-cassandra-4.0.12-bin.tar.gz
sudo mv apache-cassandra-4.0.12 /opt/
echo 'export PATH=$PATH:/opt/apache-cassandra-4.0.12/bin' >> ~/.bashrc
source ~/.bashrc
```
Ahora solo toca eliminar los archivos comprimidos para liberar espacio, uno por uno, esto es opcional:
```linux
sudo rm openlogic-openjdk-11.0.22+7-linux-x64.tar.gz
sudo rm apache-cassandra-4.0.12-bin.tar.gz
```
Con esto ya está todo listo para iniciar Cassandra con solo poner:
```linux
cassandra -f
```
Con esto se activa la consola del servidor, para poder utilizarlo, hay que esperar un rato la primera vez y entrar en otra terminal de **PowerShell** dejando abierta la anterior:
```PowerShell
ubuntu
cqlsh
```
Allí nos saldrá una salida similar a esta:
``
Connected to Test Cluster at 127.0.0.1:9042
[cqlsh 6.0.0 | Cassandra 4.0.12 | CQL spec 3.4.5 | Native protocol v5]
Use HELP for help.
``
#### Para la aplicación
Antes que nada para evitar problemas abrir *Windows PowerShell* con **permisos de administrador** y poner el siguiente comando que evitará darnos problemas con comandos NodeJS en el futuro:
```PowerShell
Set-ExecutionPolicy Unrestricted
```
Después de esto, con el **PowerShell** abierto y con sus respectivos permisos, usamos este comando de instalación y esperamos:
```PowerShell
npm install -g @ionic/cli
```
