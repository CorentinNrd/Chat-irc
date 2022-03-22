<h1>Internet Relay Chat</h1>

<h2>Présentation du projet</h2>
ce projet a été réalisé par:<br>
- Dounya Derlen (github -> https://github.com/dounyadelren)<br>
- Corentin Nordmann (github -> https://github.com/CorentinNrd)

<h2>Mise en place</h2>
Clonez ce répertoire, ouvrez un terminal et entrez <code> npm install</code> dans le dossier "irc" et le tour est joué!

<h2>Les commandes</h2>
Voici quelques commandes utiles pour utiliser notre chat ! Il faudra vous munir de minimum 3 fenêtres de terminal ( un serveur, deux clients ou plus )<br>
Dans la première fenêtre, placez vous dans le dossier "server" et entrez <code>node server</code><br>
Dans la deuxième et troisième fenêtre placez vous dans le dossier "client" et entrez <code>node client</code>, le prompt vous demandera quel pseudo vous souhaitez utiliser, attention vous êtes obligés d'en entrer un pour vous connecter au chat.<br>
<br>
NB: petite astuce, alignez vos fenêtres les unes à côté des autres afin de bien contrôller qu'à chaque action de la part d'un de vos client, le serveur affiche bien toutes les informations relatives à cette action.<br> 

<ul>
  <li><code>/nick</code> : modifie le pseudo de l'utilisateur</li>
  <li><code>/list</code> : retourne la liste de toutes les rooms du chat</li>
  <li><code>/list_user</code> ou <code>/lu</code>: retourne la liste de tout les utilisateurs du chat connectés</li>
  <li><code>/leave + nom_du_groupe</code> : quitte la room</li>
  <li><code>/quit</code> : quitte le chat</li>
  <li><code>/msg + user + message</code> : envoie un message privé à un user</li>
  <li><code>/group nom_du_groupe message</code> : envoie un message dans ce groupe même si le user n'en fait pas partie, seuls les utilisateurs de cette room verront ce message</li>
  <li><code>/users + nom_du_groupe</code> : liste la totalité des users dans la room</li>
  <li><code>/ + message</code> : envoie un message dans le chat général</li>
  <li><code>/delete</code> : supprime une room seulement possible par le créateur de la room</li>
  <li><code>/create + nom_du_groupe</code> : créer une room mais ne la rejoint pas</li>
</ul>
