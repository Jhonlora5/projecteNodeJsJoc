EXPLICACIÓ DEL JOC:

El joc consisteix en fer punts per impacte de projectil i matar altres usuaris.

Amb AWDS et pots moure, clicant amb el ratoli amb el botó esquerra envies el projectil.
Per impacte sumes 2 als punts i per matar 3.

A la columna esquerra es pot visualitzar el nom de cada usuari, amb la vida corresponent,
en inici 100, per impacte restes 5 a la vida de l'usuari impactat.

Al iniciar el joc el servidor distribueix de forma aleatoria una imatge i un color per a cada usuari, a més, envia a cada usuari el comportament de cada un d'ells, es a dir, direccio projectil, posicio, color, imatge corresponent, etc.


EXPLICACIÓ DELS DOCUMENTS:

PART DORRESPONENT AL SERVIDOR:

    Explicació arxiu per arxiu:

        constants.ts:
            Aquest fitxer conté dues constants que son la llista de colors i la llista de posibles  personatges.

        Jugador.ts:
            Conté una interficie de jugador on es descriu un model de tipus de dades.
                id => randomUUID().
                nom => Jugador1, Jugador2...
                x => Posició en el mapa.
                y => Posició en el mapa.
                vida => Punts de vida restants.
                punts => Punts del jugador.
                tipus => Personatge assignat.
                color => Color de personatge assignat.
                Preparat => Encarregat d'esperar a que els usuaris donin al si.

        tipusMissatges.ts:
            Encarregat de revisar el tipus de missatge que arriba per part del client.
            
            De usuari a servidor:
                { tipus: "moure"; x: number; y: number } Actualitza la posicio.
                { tipus: "atac"; dx: number; dy: number } Direccio del projectil.
                { tipus: "preparat" } Revisa bolea per veure si l'usuari esta preparat.
            
            De servidor a usuaris:
                { tipus: "estat"; jugadors: any[] } Estat complert del jugador, posicio, color, imatge, etc.
                { tipus: "compteEnrere"; valor: number } Mmostra compte enrrere.
                { tipus: "iniciPartida" } Comença la partida.

        utiltiats.ts:
            export function enviarATots(wss, dades)
                
                    Converteix a JSON:
                    JSON.stringify

                    Recorre tots els clients:
                    wss.clients.forEach
                    
                    Si el client està obert:
                    WebSocket.OPEN
                    
                    Envia el missatge:
                    client.send()

            Control de personatges disponibles

                let personatgesDisponibles

                    És una còpia de:

                        TIPUS_PERSONATGES

                Quan un jugador entra:

                    li assignem un personatge

                Quan surt de la partida:

                    el tornem a la llista

            
            obtenirPersonatgeAleatori

                    Si no queden personatges

                        reinicia la llista

                    Escull índex aleatori

                        Math.random

                    Agafa el personatge

                    L’elimina de la llista

                    El retorna
            
            obtenirColorAleatori 
                Fa els mateixos passos que obtenirPersonatgeAleatori pero amb la llista de colors.

            retornarPersonatge
                Quan un jugador marxa:
                    personatgesDisponibles.push()
                    Tornem el personatge a la llista.
            
            retornarColor
                Fa el mateix que retornarPersonatge pero amb el color.

        gestorPartida.ts:
            Controla l'inici de la partida.
            
            Per tal de que no s'inicii multiples vegades posem el comtador a false.
                let compteEnrereActiu = false;

            Per evitar duplicats i enviar a tots el jugadors l'inici:
                if (compteEnrereActiu) return

            Activem compteEnrrereActiu = true

            Establim que el comptador començarà en 3 segons
                let compte = 3

            Envia cada segon restant.
                setInterval

            Quan acaba aturem l'interval.
                compte < 0

            Enviem inici de la partida amb:
                iniciPartida.

            Reiniciem la variable al seu estat false.
                compteEnrrereActiu = false

        servidor.ts:

            Servidor web amb express().
            Servidor http http.createServer.
            Servidor de connexions en temps real WebSocketServer.

            Servim al client els arxius corresponents a la ruta establerta a:
                express.static()

            
            Compartim en un unic servidor el servidor http i WebSocket.
            D'aquesta manera tenim unifcat el servidor ws i http.
                const wss = new WebSocketServer({ server: servidorHttp });

            Jugadors Connectats:
                const jugadors = new Map<WebSocket, Jugador>();

                D'aquesta manera relacionem a cada jugador amb websocket.

                Quan entra un jugador:
                    wss.on("connection")
                        Limitem a 10 com a maxim de jugadors.
                        if (jugadors.size >= 10)

                        Creem un jugador:
                            Assigna a cada jugador:
                                id
                                nom
                                posició
                                vida
                                punts
                                personatge
                                color
                                preparat
                        
                        Guarda cada jugador amb:
                        jugadors.set(ws, nouJugador)

                        Enviar identitat:
                            El client rep:
                                identificador.

                Per rebre missatges:
                    ws.on("message")
                        preparat
                            Inicia un nou compte enrrere.
                        moure
                            Actualitza la posició x i y.
                        atac
                            Amb nouProjectil envia on va l'atac.
                        impacte
                            Quan un jugador rep un impacte de projectil.
                                resta vida -20
                            Si mor
                                Vida = 100
                                respawn
                            Punts
                                per matar +3
                                per cada encert de projectil +1.
                            estat
                                Envia l'estat actualitzat.

                Per a la desconnexió:
                    ws.on("close")
                        Quan un jugador surt.
                        
                        Elimina al jugador:
                            jugadors.delete()
                        Retorna personatge a la llista.
                        Retorna color.
                        Envia el nou estat.

            Finalment establim el port 3000
                ServidorHttp.listen(3000)


PART DORRESPONENT AL CLIENT:

    Explicació arxiu per arxiu:

        jugadorClients.ts:

            Interficie que conté l'estructura d'informació que tindrà cada jugador, identificador, nom, posicio...
        
        projectil.ts:

            Interficie que defineix l'atac de l'usuari, posicio, forma, color...

        connexio.ts:

            Variables i funcions encarregades de l'enviament de dades entre client i servidor.

        entrada.ts:

            Encarregat d'escoltar les tecles que estan premudes.

        estatJoc.ts:

            S'encarregara de guardar les dades de l'estat global del joc.
        
        recursos.ts:

            S'encarrega de les imatges dels personatges, agafa el nom per construir la ruta on es troba la imatge.

        
        joc.ts:

            Encarregat de gestionar el joc fent les crides corresponents a cada un dels arxius.





    

    

