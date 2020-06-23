# FGO-Calculator


掉落物：drop
交換最大上限：rewardCost
交換需求：rewardQuantity


json format:
{
    "id": "1",
    "name": "test",
    "endAt": "2010-01-01T1200"
    "drop": [
		{
			"dropName": "drop1",
			"shopList": [
				{
					"rewardName": "reward1",
					"rewardCost": 10,
					"rewardQuantity" : 20
				},

				{
					"rewardName": "reward1",
					"rewardCost": 10,
					"rewardQuantity" : 20
				}
			],
			"questList": [
				{
					"questName": "quest1"
					"questDropTotal": 0,
					"questDropQuantity": 0
				},
				{
					"questName": "quest2"
					"questDropTotal": 0,
					"questDropQuantity": 0
				}
			]
		}
	
    ]


}



{
    "id": "1",
    "name": "test",
    "shop": [
    	{
    		"dropName": "drop1",
    		"rewardList": [
				{
					"rewardName": "reward1"
					"rewardCost": 10,
					"rewardQuantity": 20
				},
				{
					"rewardName": "reward2"
					"rewardCost": 20,
					"rewardQuantity": 30
				}		
    		]
    	}
    "quest": [
    ]
    ]
}
