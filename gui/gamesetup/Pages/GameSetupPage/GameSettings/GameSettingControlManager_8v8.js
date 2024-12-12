/**
 * The GameSettingControlManager owns all GUI controls.
 */
SetupWindowPages.GameSettingControlManager = class 
{
    constructor(setupWindow)
    {
        this.setupWindow = setupWindow;

        this.rows = {};
        this.gameSettingControls = {};

        let getCategory = name =>
            g_GameSettingsLayout.findIndex(category => category.settings.indexOf(name) != -1);

        for (let name in GameSettingControls)
            this.gameSettingControls[name] =
                new GameSettingControls[name](
                    this, getCategory(name), undefined, setupWindow);

        for (let victoryCondition of g_VictoryConditions)
            this.gameSettingControls[victoryCondition.Name] =
                new VictoryConditionCheckbox(
                    victoryCondition, this, getCategory(victoryCondition.Name), undefined, setupWindow);

        const maxPlayers = g_GreatMaxPlayerCount;

        this.playerSettingControlManagers = Array.from(
            new Array(maxPlayers),
            (value, playerIndex) =>
                new PlayerSettingControlManager(playerIndex, setupWindow));
    }

    getNextRow(name)
    {
        if (this.rows[name] === undefined)
            this.rows[name] = 0;
        else
            ++this.rows[name];

        return this.rows[name];
    }

    updateSettingVisibility()
    {
        for (let name in this.gameSettingControls)
            this.gameSettingControls[name].updateVisibility();
    }

    addAutocompleteEntries(entries)
    {
        for (let name in this.gameSettingControls)
            this.gameSettingControls[name].addAutocompleteEntries(name, entries);

        for (let playerSettingControlManager of this.playerSettingControlManagers)
            playerSettingControlManager.addAutocompleteEntries(entries);
    }
}
