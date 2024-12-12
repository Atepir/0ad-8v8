// Fills out information for multiple entities
displayMultiple = function(entStates)
{
	let averageHealth = 0;
	let maxHealth = 0;
	let maxCapturePoints = 0;
	let capturePoints = (new Array(g_GreatMaxPlayerCount + 1)).fill(0);
	let playerID = 0;
	let totalCarrying = {};
	let totalLoot = {};
	let garrisonSize = 0;

	for (let entState of entStates)
	{
		playerID = entState.player; // trust that all selected entities have the same owner
		if (entState.hitpoints)
		{
			averageHealth += entState.hitpoints;
			maxHealth += entState.maxHitpoints;
		}
		if (entState.capturePoints)
		{
			maxCapturePoints += entState.maxCapturePoints;
			capturePoints = entState.capturePoints.map((v, i) => v + capturePoints[i]);
		}

		let carrying = calculateCarriedResources(
			entState.resourceCarrying || null,
			entState.trader && entState.trader.goods
		);

		if (entState.loot)
			for (let type in entState.loot)
				totalLoot[type] = (totalLoot[type] || 0) + entState.loot[type];

		for (let type in carrying)
		{
			totalCarrying[type] = (totalCarrying[type] || 0) + carrying[type];
			totalLoot[type] = (totalLoot[type] || 0) + carrying[type];
		}

		if (entState.garrisonable)
			garrisonSize += entState.garrisonable.size;

		if (entState.garrisonHolder)
			garrisonSize += entState.garrisonHolder.occupiedSlots;
	}

	Engine.GetGUIObjectByName("healthMultiple").hidden = averageHealth <= 0;
	if (averageHealth > 0)
	{
		let unitHealthBar = Engine.GetGUIObjectByName("healthBarMultiple");
		let healthSize = unitHealthBar.size;
		healthSize.rtop = 100 - 100 * Math.max(0, Math.min(1, averageHealth / maxHealth));
		unitHealthBar.size = healthSize;

		Engine.GetGUIObjectByName("healthMultiple").tooltip = getCurrentHealthTooltip({
			"hitpoints": averageHealth,
			"maxHitpoints": maxHealth
		});
	}

	Engine.GetGUIObjectByName("captureMultiple").hidden = maxCapturePoints <= 0;
	if (maxCapturePoints > 0)
	{
		let setCaptureBarPart = function(pID, startSize)
		{
			let unitCaptureBar = Engine.GetGUIObjectByName("captureBarMultiple[" + pID + "]");
			let sizeObj = unitCaptureBar.size;
			sizeObj.rtop = startSize;

			let size = 100 * Math.max(0, Math.min(1, capturePoints[pID] / maxCapturePoints));
			sizeObj.rbottom = startSize + size;
			unitCaptureBar.size = sizeObj;
			unitCaptureBar.sprite = "color:" + g_DiplomacyColors.getPlayerColor(pID, 128);
			unitCaptureBar.hidden = false;
			return startSize + size;
		};

		let size = 0;
		for (let i in capturePoints)
			if (i != playerID)
				size = setCaptureBarPart(i, size);

		// last handle the owner's points, to keep those points on the bottom for clarity
		setCaptureBarPart(playerID, size);

		Engine.GetGUIObjectByName("captureMultiple").tooltip = getCurrentHealthTooltip(
			{
				"hitpoints": capturePoints[playerID],
				"maxHitpoints": maxCapturePoints
			},
			translate("Capture Points:"));
	}

	let numberOfUnits = Engine.GetGUIObjectByName("numberOfUnits");
	numberOfUnits.caption = entStates.length;
	numberOfUnits.tooltip = "";

	if (garrisonSize)
		numberOfUnits.tooltip = sprintf(translate("%(label)s: %(details)s\n"), {
			"label": headerFont(translate("Garrison Size")),
			"details": bodyFont(garrisonSize)
		});

	if (Object.keys(totalCarrying).length)
		numberOfUnits.tooltip = sprintf(translate("%(label)s %(details)s\n"), {
			"label": headerFont(translate("Carrying:")),
			"details": bodyFont(Object.keys(totalCarrying).filter(
				res => totalCarrying[res] != 0).map(
				res => sprintf(translate("%(type)s %(amount)s"),
					{ "type": resourceIcon(res), "amount": totalCarrying[res] })).join("  "))
		});

	if (Object.keys(totalLoot).length)
		numberOfUnits.tooltip += sprintf(translate("%(label)s %(details)s"), {
			"label": headerFont(translate("Loot:")),
			"details": bodyFont(Object.keys(totalLoot).filter(
				res => totalLoot[res] != 0).map(
				res => sprintf(translate("%(type)s %(amount)s"),
					{ "type": resourceIcon(res), "amount": totalLoot[res] })).join("  "))
		});

	// Unhide Details Area
	Engine.GetGUIObjectByName("detailsAreaMultiple").hidden = false;
	Engine.GetGUIObjectByName("detailsAreaSingle").hidden = true;
}