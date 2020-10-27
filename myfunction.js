function addPlayer(id, username) {
    return {
        id: id,
        username: username
    }
}

function getPlayers(room, id) {
      var players = [];
      room.players.forEach(function (player) {
          if(player.id !== id) {
              players.push({
                  username: player.username,
                })
            }
        });
      return players;
}

module.exports = {addPlayer, getPlayers};