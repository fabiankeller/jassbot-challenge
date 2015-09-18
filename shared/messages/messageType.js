'use strict';

let SessionChoice = require('../game/sessionChoice'),
    GameMode = require('../game/gameMode'),
    CardColor = require('../deck/card').CardColor;

module.exports = {
    REQUEST_PLAYER_NAME: {
        name: 'REQUEST_PLAYER_NAME'
    },
    CHOOSE_PLAYER_NAME: {
        name: 'CHOOSE_PLAYER_NAME',
        constraints: {
            'type': {
                presence: true
            },
            'data': {
                presence: true,
                length: {
                    minimum: 1
                }
            }
        }
    },
    BROADCAST_TEAMS: {
        name: 'BROADCAST_TEAMS'
    },
    DEAL_CARDS: {
        name: 'DEAL_CARDS'
    },
    REQUEST_TRUMPF: {
        name: 'REQUEST_TRUMPF'
    },
    CHOOSE_TRUMPF: {
        name: 'CHOOSE_TRUMPF',
        constraints: {
            'type': {
                presence: true
            },
            'data.mode': {
                presence: true,
                inclusion: {
                    within: GameMode
                }
            },
            'data.trumpfColor': {
                inclusion: {
                    within: CardColor
                }
            }
        }
    },
    REJECT_TRUMPF: {
        name: 'REJECT_TRUMPF'
    },
    BROADCAST_TRUMPF: {
        name: 'BROADCAST_TRUMPF'
    },
    BROADCAST_STICH: {
        name: 'BROADCAST_STICH'
    },
    BROADCAST_WINNER_TEAM: {
        name: 'BROADCAST_WINNER_TEAM'
    },
    BROADCAST_GAME_FINISHED: {
        name: 'BROADCAST_GAME_FINISHED'
    },
    PLAYED_CARDS: {
        name: 'PLAYED_CARDS'
    },
    REQUEST_CARD: {
        name: 'REQUEST_CARD'
    },
    CHOOSE_CARD: {
        name: 'CHOOSE_CARD',
        constraints: {
            'type': {
                presence: true
            },
            'data.number': {
                presence: true,
                inclusion: {
                    within: [6,7,8,9,10,11,12,13,14]
                }
            },
            'data.color': {
                presence: true,
                inclusion: {
                    within: CardColor
                }
            }
        }
    },
    REJECT_CARD: {
        name: 'REJECT_CARD'
    },
    REQUEST_SESSION_CHOICE: {
        name: 'REQUEST_SESSION_CHOICE'
    },
    CHOOSE_SESSION: {
        name: 'CHOOSE_SESSION',
        constraints: {
            'type': {
                presence: true
            },
            'data.sessionChoice': {
                presence: true,
                inclusion: {
                    within: SessionChoice
                }
            },
            'data.sessionName': {
                length: {
                    minimum: 1
                }
            }
        }
    },
    BROADCAST_SESSION_JOINED: {
        name: 'BROADCAST_SESSION_JOINED'
    },
    BAD_MESSAGE: {
        name: 'BAD_MESSAGE'
    }
};