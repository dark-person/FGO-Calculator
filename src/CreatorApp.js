import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function CreatorApp(props){

	const emptyDrop = {
		"dropName": "",
		"shopList": [
			{
				"rewardName": "",
				"rewardCost": 0,
				"rewardQuantity" : 0
			}
		],
		"questList": [
			{
				"questName": "",
				"questDropTotal": 0,
				"questDropQuantity": 0,
				"questAp": 0
			}
		]
	}

	const emptyShopItem = {
		"rewardName": "",
		"rewardCost": 0,
		"rewardQuantity" : 0
	}

	const emptyQuest = {
		"questName": "",
		"questDropTotal": 0,
		"questDropQuantity": 0,
		"questAp": 0
	}
	

	const [id, setId] = useState(-1);
	const [name, setName] = useState("");
	const [datetime, setDatetime] = useState("2020-01-01T12:00");

	const [dropList, setDropList] = useState([{...emptyDrop}]);
	
	const [resultJson, setResultJson] = useState({});

	function handleAddDrop(event){
		let temp = [...dropList]
		temp.push({...emptyDrop})
		setDropList(temp)
	}

	function handleAddReward(event){
		let index = event.target.value

		let temp = [...dropList]
		temp[index].shopList.push({...emptyShopItem})
		setDropList(temp)
	}

	function handleAddQuest(event){
		let target = event.target
		let dropIndex = target.value

		let temp = [...dropList]
		temp[dropIndex].questList.push({...emptyQuest})
		setDropList(temp)
	}

	function handleDeleteDrop(event){
		console.log(event.target.value)
		let temp = [...dropList]
		temp.splice(event.target.value,1)
		setDropList(temp)
	}

	function handleDeleteReward(event){
		let target = event.target
		let dropIndex = target.value.split("-")[0]
		let rewardIndex = target.value.split("-")[1]

		let temp = [...dropList]
		temp[dropIndex].shopList.splice(rewardIndex,1)
		setDropList(temp)
	}

	function handleDeleteQuest(event){
		let target = event.target
		let dropIndex = target.value.split("-")[0]
		let questIndex = target.value.split("-")[1]

		let temp = [...dropList]
		temp[dropIndex].questList.splice(questIndex,1)
		setDropList(temp)
	}

	//=======================================

	function handleIdChange(event){
		let value = event.target.value;
		setId(value);
	}

	function handleNameChange(event){
		let value = event.target.value;
		setName(value);
	}

	function handleDatetimeChange(event){
		let target = event.target;
		setDatetime(target.value);
	}

	//========================================

	function handleDropNameChange(event){
		let target = event.target
		let name = target.name.split("-")[0]
		let index = target.name.split("-")[1]

		let temp = [...dropList]
		temp[index].dropName = target.value
		setDropList(temp)
	}

	function handleRewardChange(event){
		let target = event.target
		let name = target.name.split("-")[0]
		let dropIndex = target.name.split("-")[1]
		let rewardIndex = target.name.split("-")[2]

		let temp = [...dropList]
		temp[dropIndex].shopList[rewardIndex][name] = 
			(name === "rewardName" ? target.value : 
				(target.value ?
      				Number(target.value) :
      				target.value))
		setDropList(temp)
	}

	function handleQuestChange(event){
		let target = event.target
		let name = target.name.split("-")[0]
		let dropIndex = target.name.split("-")[1]
		let questIndex = target.name.split("-")[2]

		let temp = [...dropList]
		temp[dropIndex].questList[questIndex][name] = 
			(name === "questName" ? target.value : 
				(target.value ?
      				Number(target.value) :
      				target.value))
		setDropList(temp)
	}

	function setJson(){
		var jsonData = {
			...resultJson,
			"id": Number(id),
			"name": name,
			"endAt": datetime,
			"drop": dropList
		};

		setResultJson(jsonData);
	}

	

	return (
		<div>
			<h3>JSON Creator</h3>
			<hr/>
			<Link to="/">Home Page</Link>
			<hr/>
			
			<Form>
				<Form.Group as={Row}>
					<Form.Label column sm={2}>ID:</Form.Label>
					<Col>
						<Form.Control 
							type="number" 
							value={id}
							onChange={handleIdChange} />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm={2}>活動名稱：</Form.Label>
					<Col>
						<Form.Control
							type="text"
							className="activity-name"
							value={name}
							onChange={handleNameChange}/>
					</Col>
					
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm={2}>結束時間：</Form.Label>
					<Col>
						<Form.Control
							as="input"
							type="datetime-local"
							className="date"
							value={datetime}
							onChange={handleDatetimeChange}
							/>
					</Col>
				</Form.Group>
			</Form>

			<hr/>

			<Row className="mb-2">
				<Col>
					掉落物列表{' '}
					<Button variant="info" size="sm" onClick={handleAddDrop}>+</Button>{' '}
				</Col>
			</Row>

			{
				dropList.map((drop, dropIndex) => 
					<Card key={"drop-"+dropIndex} className="pt-2 pl-2 pr-2 mb-2 ml-1 mr-1">
						<Form>
							<Form.Group as={Row}>
								<Form.Label column sm={3}>掉落物名稱：</Form.Label>
								<Col sm={8}>
									<Form.Control
										type="text"
										name={"dropName-"+dropIndex}
										value={drop.dropName}
										onChange={handleDropNameChange}/>
								</Col>
								<Col sm={1}>
									<Button variant="danger" size="sm" value={dropIndex} onClick={handleDeleteDrop}>-</Button>
								</Col>
							</Form.Group>
						</Form>

						<Form.Group as={Row}>
							<Col sm={1}></Col>
							<Col>
								<Table striped bordered hover>
									<thead>
										<tr>
											<td>交易物{' '}<Button variant="info" size="sm" value={dropIndex} onClick={handleAddReward}>+</Button>{' '}</td>
											<td>需求數</td>
											<td>數量</td>
											<td></td>
										</tr>
									</thead>
									<tbody>
										{
											drop.shopList.map((reward,rewardIndex) => 
												<tr key={rewardIndex}>
													<td>
														<Form.Control 
															type="text"
															name={"rewardName-"+dropIndex+"-"+rewardIndex}
															value={reward.rewardName}
															onChange={handleRewardChange}/>
													</td>
													<td>
														<Form.Control
															type="number"
															name={"rewardCost-"+dropIndex+"-"+rewardIndex}
															value={reward.rewardCost}
															onChange={handleRewardChange}/>
													</td>
													<td>
														<Form.Control
															type="number"
															name={"rewardQuantity-"+dropIndex+"-"+rewardIndex}
															value={reward.rewardQuantity}
															onChange={handleRewardChange}/>
													</td>
													<td>
														<Button variant="danger" value={dropIndex+"-"+rewardIndex} onClick={handleDeleteReward}>-</Button>
													</td>
												</tr>
												)
										}
									</tbody>
								</Table>
							</Col>

						</Form.Group>

						<Form.Group as={Row}>
							<Col sm={1}></Col>
							<Col>
								<Table striped bordered hover>
									<thead>
										<tr>
											<td>關卡名稱{' '}<Button variant="info" size="sm" value={dropIndex} onClick={handleAddQuest}>+</Button>{' '}</td>
											<td>掉落數<br/>枠数</td>
											<td>堆數<br/>ドロップ個数</td>
											<td>AP</td>
											<td></td>
										</tr>
									</thead>
									<tbody>
									{
										drop.questList.map((quest, questIndex) => 
											<tr key={questIndex}>
												<td>
													<Form.Control 
														type="text"
														name={"questName-"+dropIndex+"-"+questIndex}
														value={quest.questName}
														onChange={handleQuestChange}/>
												</td>
												<td>
													<Form.Control 
														type="number"
														name={"questDropTotal-"+dropIndex+"-"+questIndex}
														value={quest.questDropTotal}
														onChange={handleQuestChange}/>
												</td>
												<td>
													<Form.Control 
														type="number"
														name={"questDropQuantity-"+dropIndex+"-"+questIndex}
														value={quest.questDropQuantity}
														onChange={handleQuestChange}/>
												</td>
												<td>
													<Form.Control
														type="number"
														name={"questAp-"+dropIndex+"-"+questIndex}
														value={quest.questAp}
														onChange={handleQuestChange}/>
												</td>
												<td>
													<Button variant="danger" value={dropIndex+"-"+questIndex} onClick={handleDeleteQuest}>-</Button>
												</td>
											</tr>)
									}
									</tbody>
								</Table>
							</Col>
						</Form.Group>
					</Card>
					)
			}


			<Form>
				{/*<Row>
					<Col>
						掉落物列表<i className="fas fa-plus-square" onClick={handleAddDrop}></i>
					</Col>
				</Row>
				
				<br/>
				{
					dropDetail.map((item,dropIndex) =>
						<Card>
						<Form.Group key={dropIndex}> 
							<Row>
								<Form.Label column sm={2}>掉落物名稱：</Form.Label>
								<Col>
									<Form.Control 
										name={dropIndex}
										type="text"
										value={item.dropName}
										onChange={handleDropNameChange}
									/>
								</Col>
							</Row>
							
							<br/>
							<Button variant="info" onClick={handleAddReward} name={dropIndex}>新增交易物</Button>{' '}
							<br />

							<Row>
								<Col sm={2}></Col>
								<Col>
									<Table striped bordered hover>
										<thead>
											<tr>
												<td>交易物</td>
												<td>最大數量</td>
												<td>需求數</td>
											</tr>
										</thead>
										<tbody>
											{
												item.rewardList.map((reward,rewardIndex) =>
													<tr key={rewardIndex}>
														<td>
															<Form.Control
																type="text"
																value={reward.rewardName}
																name={dropIndex+"-"+rewardIndex+"-"+"rewardName"}
																onChange={handleRewardInputChange}
																/>
														</td>
														<td>
															<Form.Control
																type="number"
																value={reward.rewardQuantity}
																name={dropIndex+"-"+rewardIndex+"-"+"rewardQuantity"}
																onChange={handleRewardInputChange}
																/>
														</td>
														<td>
															<Form.Control
																type="number"
																value={reward.rewardCost}
																name={dropIndex+"-"+rewardIndex+"-"+"rewardCost"}
																onChange={handleRewardInputChange}
																/>
														</td>
													</tr>
													)
											}
										</tbody>
									</Table>	
								</Col>
								<Col sm={1}></Col>
							</Row>

							<Row>
								<Col sm={1}></Col>
								<Col>
									<Table striped bordered hover>
										<thead>
											<tr>
												<td>關卡名稱</td>
												<td>掉落數<br/>枠数</td>
												<td>堆數<br/>ドロップ個数</td>
											</tr>
										</thead>
										<tbody>
											{
												[1,2,3].map(tempKey => 
													<tr key={tempKey}>
														<td>
															<Form.Control
																type="text"
																name={dropIndex+"-questName"}
																value={}/>
														</td>
														<td>
															<Form.Control
																type="number"
																name={dropIndex+"questDropTotal"}/>
														</td>

														<td>
															<Form.Control
																type="number"
																name={dropIndex+"questDropQuantity"}/>
														</td>
													</tr>
												)
											}
											
										</tbody>
									</Table>
								</Col>
							</Row>

						</Form.Group>
						</Card>)
				}*/}
				
			</Form>

			<Button variant="success" onClick={setJson}>生成</Button>
			<hr/>

			<pre style={{textAlign: 'left'}}>{JSON.stringify(resultJson,null,4)}</pre>
			

		</div>
		);
}

export default CreatorApp;