import React, {useState, useEffect} from 'react';

import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import CreatorApp from "./CreatorApp.js"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

import cellEditFactory from 'react-bootstrap-table2-editor'; 
import BootstrapTable from 'react-bootstrap-table-next';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck'
import CardGroup from 'react-bootstrap/CardGroup'
import Table from 'react-bootstrap/Table'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

function RewardTable(props){

  const reducer = (accumulator, currentValue,currentIndex) => 
    accumulator + currentValue.rewardCost * props.state[currentIndex];

  return (
      <Table striped bordered hover 
        size="sm" responsive="sm"
        className="reward-table">
        <thead>
           <tr>
            <th>獎勵</th>
            <th>需要數量</th>
            <th>掉落物需求</th>
            <th>總掉落物需求</th>
          </tr>
        </thead>
        <tbody>
        {
          props.shopList.map((reward, rewardIndex) =>
            <tr key={rewardIndex}>
              <td className="name-td">{reward.rewardName}</td>
              <td className="number-td-required">
                <Form inline onSubmit={(event) => event.preventDefault()}>
                  <Form.Control
                    as="input"
                    type="number"
                    name={"rewardState-"+props.dropIndex+"-"+rewardIndex}
                    min="0"
                    max={reward.rewardQuantity}
                    value={props.rewardState[rewardIndex]}
                    onChange={props.handler}
                    />
                    <Form.Label>{" /"+reward.rewardQuantity}</Form.Label>
                </Form>
              </td>
              <td className="number-td-cost">{reward.rewardCost}</td>
              <td className="number-td-total">{props.rewardState[rewardIndex]*reward.rewardCost}</td>
            </tr>
            )
        }
          <tr key={997}>
            <td></td>
            <td></td>
            <td>總計：</td>
            <td>{props.total}</td>
          </tr>

          <tr key={998}>
            <td></td>
            <td></td>
            <td>現有：</td>
            <td>{props.owned}</td>
          </tr>

          <tr key={999}>
            <td></td>
            <td></td>
            <td>尚欠：</td>
            <td>{(props.total - props.owned >= 0 ? props.total-props.owned : 0)}</td>
          </tr>

        </tbody>
      </Table>
    );
}

function Calculator(props){

  const [activityId, setActivityId] = 
    useState(localStorage.getItem('activityId') || 0)
  //const [activityData, setActivityData] = useState({});
  const [endTime, setEndTime] = useState("2099-12-31T12:00")
  const [apLimit, setApLimit] = 
    useState(localStorage.getItem('apLimit') || 20)

  const [dropListData, setDropListData] = useState([])
  const [rewardState, setRewardState] = 
    useState(JSON.parse(localStorage.getItem("rewardState"))||[])
  const [totalList, setTotalList] = useState(
    JSON.parse(localStorage.getItem("totalList"))||[])

  const [ownedList, setOwnedList] = 
    useState(JSON.parse(localStorage.getItem("ownedList"))||[])
  const [boostList, setBoostList] = 
    useState(JSON.parse(localStorage.getItem("boostList"))||[])

  const [selectedQuestList, setSelectedQuestList] = 
    useState(JSON.parse(localStorage.getItem('selectedQuestList'))||[])

  var currentTime = new Date()

  useEffect(init,[])
  
  function init(){

    console.log("start with "+activityId);
    setEndTime(data.activity[activityId].endAt)
    setDropListData(data.activity[activityId].drop)

    if (activityId === 0){
      return
    }

    let tempState = data.activity[activityId].drop.map(
      (drop, dropIndex) => (
        drop.shopList.map(reward => 0)
        ))
    let tempTotal = data.activity[activityId].drop.map(
      (drop, dropIndex) => 0)
    let tempOwned = data.activity[activityId].drop.map(
      (drop, dropIndex) => 0)
    let tempBoost = data.activity[activityId].drop.map(
      (drop, dropIndex) => 0)

    if (rewardState === undefined || rewardState === []){
      setRewardState(tempState)
    }
    if (totalList === undefined || totalList === []){
      setTotalList(tempTotal)
    }
    
    if (ownedList === undefined || ownedList === []){
      setOwnedList(tempOwned)
    }

    if (boostList === undefined || boostList === []){
      setBoostList(tempBoost)
    }
  }

  function timeDifferenceInMinutes(){
    const diffTime = Math.abs(new Date(endTime) - currentTime)
    const diffMin = Math.ceil(diffTime / (1000*60))
    return diffMin
  }

  function averageDropPerQuest(dropIndex){
    let selectQuestId = selectedQuestList[dropIndex]

    let questData = dropListData[dropIndex].questList[selectQuestId]

    let averageDrop = questData.questDropTotal + questData.questDropQuantity * boostList[dropIndex]

    return averageDrop
  }

  function questTime(dropIndex){
    let averageDrop = averageDropPerQuest(dropIndex)

    let dropNeeded = totalList[dropIndex] - ownedList[dropIndex]

    return Math.ceil(dropNeeded/averageDrop)

  }

  function apRequired(dropIndex){

    let selectQuestId = selectedQuestList[dropIndex]

    let questData = dropListData[dropIndex].questList[selectQuestId]

    return questTime(dropIndex) * questData.questAp
  }

  function totalApRequired(){
    let total = dropListData.map((drop, dropIndex) => 
      apRequired(dropIndex)).reduce(
        (accumulator, currentValue) => accumulator + currentValue, 0)

    return total
  }

  function handleActivityChange(event){
    let value = event.target.value

    setActivityId(value)
    setEndTime(data.activity[value].endAt)
    setDropListData(data.activity[value].drop)

    //localStorage.clear()
    //localStorage.removeItem('apLimit')
    localStorage.setItem('apLimit',apLimit)
    localStorage.setItem('activityId',value)

    //console.log(value)
    if (value === "0"){
      return
    }

    let tempState = data.activity[value].drop.map(
      (drop, dropIndex) => (
        drop.shopList.map(reward => 0)
        ))

    let tempTotal = data.activity[value].drop.map(
      (drop, dropIndex) => 0)
    let tempOwned = data.activity[value].drop.map(
      (drop, dropIndex) => 0)
    let tempBoost = data.activity[value].drop.map(
      (drop, dropIndex) => 0)

    setRewardState(tempState)
    setTotalList(tempTotal)
    setOwnedList(tempOwned)
    setBoostList(tempBoost)

    localStorage.setItem('rewardState',JSON.stringify(tempState))
    localStorage.setItem('totalList',JSON.stringify(tempTotal))
    localStorage.setItem('ownedList',JSON.stringify(tempOwned))
    localStorage.setItem('boostList',JSON.stringify(tempBoost))

    let tempSelectedQuest = data.activity[value].drop.map(
      (drop, dropIndex) => 0)

    setSelectedQuestList(tempSelectedQuest)
    localStorage.setItem('selectedQuestList',JSON.stringify(tempSelectedQuest))
  }

  function handleRewardChange(event){
    let target = event.target
    let value = (target.value ?
      Math.max(Number(target.min), Math.min(Number(target.max), Number(target.value))) :
      target.value)

    let name = target.name.split("-")[0]
    let dropIndex = target.name.split("-")[1]
    let rewardIndex = target.name.split("-")[2]

    let tempRewardState = [...rewardState]
    tempRewardState[dropIndex][rewardIndex] = value
    setRewardState(tempRewardState)
    localStorage.setItem('rewardState',JSON.stringify(tempRewardState))

    let tempTotal = tempRewardState.map((drop, dropIndex) =>
      drop.reduce((accumulator, currentValue, currentIndex) =>
        accumulator + currentValue * 
          dropListData[dropIndex].shopList[currentIndex].rewardCost,0
        ))
    setTotalList(tempTotal)
    localStorage.setItem('totalList',JSON.stringify(tempTotal))
  }

  function handleOwnedChange(event){
    let target = event.target
    let value = (target.value ? Math.max(Number(target.min), Number(target.value)) : target.value)

    let name = target.name.split("-")[0]
    let dropIndex = target.name.split("-")[1]

    let tempOwned = [...ownedList]
    tempOwned[dropIndex] = value
    setOwnedList(tempOwned)
    localStorage.setItem('ownedList',JSON.stringify(tempOwned))
  }

  function handleBoostChange(event){
    let target = event.target
    let value = (target.value ? Math.max(Number(target.min), Number(target.value)) : target.value)

    let name = target.name.split("-")[0]
    let dropIndex = target.name.split("-")[1]

    let tempBoost = [...boostList]
    tempBoost[dropIndex] = value
    setBoostList(tempBoost)
    localStorage.setItem('boostList',JSON.stringify(tempBoost))
  }

  function handleSelectedQuestChange(event){
    let target = event.target

    let name = target.name.split("-")[0]
    let dropIndex = target.name.split("-")[1]
    
    let tempSelectedQuest = [...selectedQuestList]
    tempSelectedQuest[dropIndex] = target.value
    setSelectedQuestList(tempSelectedQuest)
    localStorage.setItem('selectedQuestList',JSON.stringify(tempSelectedQuest))
  }

  function handleApLimitChange(event){
    let target = event.target
    let value = (target.value ? Math.max(Number(target.min), Number(target.value)) : target.value)

    setApLimit(value)
    localStorage.setItem('apLimit',value)
  }


  let data = require("./activity.json");

  return (
    <Container bg="light" fluid>
      <h2 className="text-center">FGO 活動周回規劃</h2>
      <hr/>

      <hr/>
      
      <Form onSubmit={(event) => event.preventDefault()}>
        <Form.Group as={Row}>
          <Form.Label column>選擇活動：</Form.Label>
          <Col>
            <Form.Control
              as="select"
              value={activityId}
              onChange={handleActivityChange}>
              {
                data.activity.map(item =>
                  <option key={item.id} value={item.id}>{item.name}</option>)
              }
            </Form.Control>
          </Col>
        </Form.Group>
      </Form> 
        {
          activityId == 0 ? <div></div> :
          <div>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column>AP上限</Form.Label>
                <Col>
                  <Form.Control 
                    as="input"
                    type="number"
                    name="apLimit"
                    min="0"
                    value={apLimit}
                    onChange={handleApLimitChange}/>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column>結束時間</Form.Label>
                <Col style={{textAlign: "left"}}>
                  {new Date(endTime).getFullYear()+"-"+
                  (new Date(endTime).getMonth()+1).toString().padStart(2, '0')+"-"+
                  new Date(endTime).getDate().toString().padStart(2, '0')+" "+
                  new Date(endTime).getHours().toString().padStart(2, '0')+":"+
                  new Date(endTime).getMinutes().toString().padStart(2, '0')
                }
                </Col>
              </Form.Group>
            </Form>

            <Tabs defaultActiveKey={0}>
              {
                dropListData.map((drop, dropIndex) => 
                  <Tab key={dropIndex} eventKey={dropIndex} title={drop.dropName}>
                    {<RewardTable
                      shopList={drop.shopList}
                      rewardState={rewardState[dropIndex]}
                      dropIndex={dropIndex}
                      handler={handleRewardChange}
                      total={totalList[dropIndex]}
                      owned={ownedList[dropIndex]}
                      />}
                  </Tab>
                  )
              }
              <Tab eventKey={999} title={"總論"}>
                <Table striped bordered hover 
                  size="sm" responsive="sm"
                  className="conclusion-table">
                  <thead>
                    <tr>
                      <td>掉落物</td>
                      <td>現有數量</td>
                      <td>加成量</td>
                      <td>副本選擇</td>
                      <td>場次</td>
                      <td>所需體力</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      dropListData.map((drop, dropIndex) => (
                        <tr key={dropIndex}>
                          <td className="conclusion-table drop-name">{drop.dropName}</td>
                          <td className="conclusion-table owned">
                            <Form.Control 
                              as="input"
                              type="number"
                              name={"owned-"+dropIndex}
                              min="0"
                              value={ownedList[dropIndex]}
                              onChange={handleOwnedChange}/>
                          </td>
                          <td className="conclusion-table boost">
                            <Form.Control 
                              as="input"
                              type="number"
                              name={"boost-"+dropIndex}
                              min="0"
                              value={boostList[dropIndex]}
                              onChange={handleBoostChange}
                              />
                          </td>
                          <td className="conclusion-table quest-select">
                            <Form.Control
                              as="select"
                              value={selectedQuestList[dropIndex]}
                              onChange={handleSelectedQuestChange}
                              name={"quest-"+dropIndex}>
                              {
                              
                                drop.questList.map((quest,questId) =>
                                  <option key={questId} value={questId}>{quest.questName}</option>)
                              }
                            </Form.Control>
                          </td>
                          <td className="conclusion-table time">
                            {
                              questTime(dropIndex)
                            }
                          </td>
                          <td className="conclusion-table ap">
                          {
                            apRequired(dropIndex)
                          }
                          </td>
                        </tr>
                        ))}
                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>所需體力：</td>
                        <td>
                        {
                          dropListData.map((drop, dropIndex) => 
                            apRequired(dropIndex)).reduce(
                            (accumulator, currentValue) => accumulator + currentValue, 0)
                        }
                        </td>
                      </tr>  
                    }

                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>自然回體：</td>
                        <td>{Math.floor(timeDifferenceInMinutes() /5)}</td>
                      </tr>
                    }

                    {
                       <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>尚欠：</td>
                        <td>
                        {
                          Math.max(0, 
                            totalApRequired() - Math.floor(timeDifferenceInMinutes() / 5) )                      
                        }
                        </td>
                      </tr>
                    }

                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>}
                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>金蘋果：</td>
                        <td>
                        {
                          Math.max(0,
                          (totalApRequired() - 
                            Math.floor(timeDifferenceInMinutes() / 5)) / apLimit)
                        }
                        </td>
                       </tr>
                    }
                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>銀蘋果：</td>
                        <td>
                        {
                          Math.max(0,(totalApRequired() - Math.floor(timeDifferenceInMinutes() / 5)) / Math.ceil(apLimit/2))
                        }
                        </td>
                      </tr>
                    }
                    { 
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>銅蘋果：</td>
                        <td>
                          {Math.max(0,(totalApRequired() - Math.floor(timeDifferenceInMinutes() / 5)) / 10)}
                        </td>
                      </tr>}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </div>
        }
      
        <Link to="/creator">JSON Create</Link>

    </Container>
  );
}

function App(){
  return (
    <Router basename={window.location.pathname || ''}>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Calculator />
          </Route>
          <Route path="/creator">
            <CreatorApp />
          </Route>
        </Switch>
      </div>
    </Router>
    )
}

export default App;
