GameSettingControlManager.playerSettingControlManagers = Array.from(
    new Array(g_GreatMaxPlayerCount),
    (value, playerIndex) =>
        new PlayerSettingControlManager(playerIndex, setupWindow));