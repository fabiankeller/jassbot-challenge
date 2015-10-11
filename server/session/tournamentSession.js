'use strict';

import ClientApi from '../communication/clientApi.js';
import SessionType from '../../shared/session/sessionType.js';
import CloseEventCode from '../communication/closeEventCode.js';
import Ranking from '../game/ranking/ranking.js';
import RankingTable from './rankingTable.js';
import SingleGameSession from './singleGameSession.js';
import {polyfill} from 'babel';
import _ from 'lodash';
import UUID from 'uuid';

let TournamentSession = {
    type: SessionType.TOURNAMENT,

    handleLeavingClient(playerName) {
        let player = this.getPlayer(playerName);

        player.connected = false;
        player.clients.forEach((actClient) => {
            this.clientApi.removeClient(actClient, CloseEventCode.ABNORMAL, 'One of the clients of this player disconnected');
        });
    },

    addPlayer(webSocket, playerName) {
        this.clientApi.addClient(webSocket).catch(this.handleLeavingClient.bind(this, playerName));

        let player = this.getPlayer(playerName);

        if (player) {
            if (player.clients.length < 2) {
                player.clients.push(webSocket);
            } else {
                this.clientApi.removeClient(webSocket, CloseEventCode.ABNORMAL, 'This Player already has two registered clients!');
                return;
            }
        } else {
            this.players.push({
                playerName,
                isPlaying: false,
                connected: true,
                clients: [
                    webSocket
                ]
            });
            this.rankingTable.addPlayer(playerName);
        }

        this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
    },

    getPlayer(playerName) {
        return this.players.find((actPlayer) => {
            return actPlayer.playerName === playerName;
        });
    },

    addSpectator(webSocket) {
        this.clientApi.addClient(webSocket);
        this.spectators.push(webSocket);
    },

    isComplete() {
        let numberOfConnectedWebsockets = _.flatten(this.players.map(player => player.clients)).length;
        return numberOfConnectedWebsockets === 4;
        // TODO how to really start a tournament?
    },

    start() {
        this.players.forEach(element => this.ranking.addPlayer(element.playerName));

        this.pairings = _.flatten(this.players.map((player, index) => {
            return this.players.filter((secondPlayer, secondIndex) => {
                return secondIndex > index;
            }).map((secondPlayer) => {
                return {
                    player1: player,
                    player2: secondPlayer
                };
            });
        }));
        this.startPairingSessions();
        this.ranking.updateRatings();
    },

    startPairingSessions() {
        this.pairings.forEach(pairing => {
            let {player1, player2} = pairing;
            if (!player1.isPlaying && !player2.isPlaying) {
                let session = SingleGameSession.create(UUID.v4());

                session.addPlayer(player1.clients[0], player1.playerName);
                session.addPlayer(player2.clients[0], player2.playerName);
                session.addPlayer(player1.clients[1], player1.playerName);
                session.addPlayer(player2.clients[1], player2.playerName);

                player1.isPlaying = true;
                player2.isPlaying = true;

                session.start().then((winningTeam) => {
                    console.log(session.teams);
                    let firstPlayerWon;

                    if (winningTeam.name.indexOf(player1).name > -1) {
                        this.ranking.updateMatchResult({winner: player1.playerName, loser: player2.playerName});
                        firstPlayerWon = true;
                    } else {
                        this.ranking.updateMatchResult({winner: player2.playerName, loser: player1.playerName});
                        firstPlayerWon = false;
                    }

                    this.rankingTable.addPairingResult(player1.playerName, player2.playerName, firstPlayerWon);

                    player1.isPlaying = false;
                    player2.isPlaying = false;
                    _.remove(this.pairings, pairing);
                    this.clientApi.broadcastTournamentRankingTable(this.rankingTable);
                    this.startPairingSessions();
                });
            }
        });
    },

    close(code, message) {
        this.clientApi.closeAll(code, message);
    }
};

export default {
    create(sessionName) {
        let session = Object.create(TournamentSession);
        session.name = sessionName;
        session.players = [];
        session.spectators = [];
        session.clientApi = ClientApi.create();
        session.pairings = [];
        session.ranking = Ranking.create();
        session.rankingTable = RankingTable.create();
        return session;
    }
};