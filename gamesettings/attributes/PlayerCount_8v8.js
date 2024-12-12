GameSettings.prototype.Attributes.PlayerCount.setNb = function(nb) {
    this.nbPlayers = Math.max(1, Math.min(g_GreatMaxPlayerCount, nb));
}