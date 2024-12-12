resetGeneralPanel = function()
{
	for (let h = 0; h < g_MaxHeadingTitle; ++h)
	{
		Engine.GetGUIObjectByName("titleHeading[" + h + "]").hidden = true;
		Engine.GetGUIObjectByName("Heading[" + h + "]").hidden = true;
		for (let p = 0; p < g_GreatMaxPlayerCount; ++p)
		{
			Engine.GetGUIObjectByName("valueData[" + p + "][" + h + "]").hidden = true;
			for (let t = 0; t < g_MaxTeams; ++t)
			{
				Engine.GetGUIObjectByName("valueDataTeam[" + t + "][" + p + "][" + h + "]").hidden = true;
				Engine.GetGUIObjectByName("valueDataTeam[" + t + "][" + h + "]").hidden = true;
			}
		}
	}
}

updateGeneralPanelCounter = function(allCounters)
{
	let counters = allCounters.filter(counter => !counter.hideInSummary);
	let rowPlayerObjectWidth = 0;
	let left = 0;

	for (let p = 0; p < g_GreatMaxPlayerCount; ++p)
	{
		left = 240;
		let counterObject;

		for (let w in counters)
		{
			counterObject = Engine.GetGUIObjectByName("valueData[" + p + "][" + w + "]");
			counterObject.size = left + " " + counters[w].verticalOffset + " " + (left + counters[w].width) + " 100%";
			counterObject.hidden = false;
			left += counters[w].width;
		}

		if (rowPlayerObjectWidth == 0)
			rowPlayerObjectWidth = left;

		let counterTotalObject;
		for (let t = 0; t < g_MaxTeams; ++t)
		{
			left = 240;
			for (let w in counters)
			{
				counterObject = Engine.GetGUIObjectByName("valueDataTeam[" + t + "][" + p + "][" + w + "]");
				counterObject.size = left + " " + counters[w].verticalOffset + " " + (left + counters[w].width) + " 100%";
				counterObject.hidden = false;

				if (g_Teams[t])
				{
					let yStart = 25 + g_Teams[t].length * (g_PlayerBoxYSize + g_PlayerBoxGap) + 3 + counters[w].verticalOffset;
					counterTotalObject = Engine.GetGUIObjectByName("valueDataTeam[" + t + "][" + w + "]");
					counterTotalObject.size = (left + 20) + " " + yStart + " " + (left + counters[w].width) + " 100%";
					counterTotalObject.hidden = false;
				}

				left += counters[w].width;
			}
		}
	}
	return rowPlayerObjectWidth;
}

initPlayerBoxPositions = function()
{
	for (let h = 0; h < g_GreatMaxPlayerCount; ++h)
	{
		let playerBox = Engine.GetGUIObjectByName("playerBox[" + h + "]");
		let boxSize = playerBox.size;
		boxSize.top += h * (g_PlayerBoxYSize + g_PlayerBoxGap);
		boxSize.bottom = boxSize.top + g_PlayerBoxYSize;
		playerBox.size = boxSize;

		for (let i = 0; i < g_MaxTeams; ++i)
		{
			let playerBoxt = Engine.GetGUIObjectByName("playerBoxt[" + i + "][" + h + "]");
			boxSize = playerBoxt.size;
			boxSize.top += h * (g_PlayerBoxYSize + g_PlayerBoxGap);
			boxSize.bottom = boxSize.top + g_PlayerBoxYSize;
			playerBoxt.size = boxSize;
		}
	}
}