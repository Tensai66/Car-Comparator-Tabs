/***************************************************************************
 Name: Mayur Khatri, mayur_khatri@student.cs.uml.edu
 Computer Science Student, UMass Lowell
 Comp.4610, GUI Programming I
 File: /usr/cs/2018/mkhatri/public_html/461f2017/hw6/App.js
 Created: 03-dec-2017
 Last updated by HL: 03-dec-2017, 19:56
 Description: JSX single-page app with error checking using React Javascript 
              Validation for the dynamic car comparator with table
              (Since React has a virtual DOM, that then modifies the real DOM)
              Also includes tabs which has tables and sliders which dynamically
              update the values in the input boxes and remove/remove all for
              the tabs which contain the tables.
****************************************************************************/

import React, { Component } from 'react';
import Button from 'material-ui/Button';
import InputRange from 'react-input-range';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import 'react-input-range/lib/css/index.css'
import 'react-tabs/style/react-tabs.css'
import './App.css';

class App extends Component {
  // State holds the states of the input fields to be updated whenever the user has keyboard input
  // Here we also have a state for the current page state, and also to display the table
  state = {
    current: 'home', // The home page where the user first enters their car price/gas price
    milesDriven: '',
    costPerGallon: '',
    carPrice1: '',
    carPrice2: '',
    carPrice3: '',
    prices: [], // The array for the prices of the cars
    mpgTableArray: [], // The array for the table which holds the values 
    milesPerGallon: '',
    tabs: '',
    selectedIndex: 0,
    tabsIndex: [],
    displayTable: { display: 'none' },
    errors: {}
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: [e.target.value] }) // Changes the specified targets state value
  }

  home = (e) => {
    e.preventDefault()
    const {
      milesDriven,
      costPerGallon,
      errors
    } = this.state
    if(milesDriven === '') {
      errors.milesDriven = " Miles driven field cannot be empty"
    }
    else if(costPerGallon === '') {
      errors.costPerGallon = " Cost per gallon field cannot be empty"
    }
    if(milesDriven < 0) {
      errors.milesDriven = " Miles driven field must be a positive value greater than 0"
    }
    if(costPerGallon < 0) {
      errors.costPerGallon = " Cost per gallon field must be a positive value greater than 0"
    }
    if(milesDriven !== '' && costPerGallon !== '' && milesDriven > 0 && costPerGallon > 0) {
      this.setState({ current: 'carPricesContent' })
    } else {
      this.setState({ errors })
    }
  }
  
  calculateCarPrices = (e) => {
    e.preventDefault()
    let {
      carPrice1,
      carPrice2,
      carPrice3,
      prices,
      errors
    } = this.state
    if(carPrice1 === '') {
      errors.carPrice1 = " Car price 1 field cannot be empty"
    }
    else if(carPrice2 === '') {
      errors.carPrice2 = " Car price 2 field cannot be empty"
    }
    else if(carPrice3 === '') {
      errors.carPrice3 = " Car price 3 field cannot be empty"
    }
    if(carPrice1 < 0) {
      errors.carPrice1 = " Car price 1 field must be a positive value greater than 0"
    }
    else if(carPrice2 < 0) {
      errors.carPrice2 = " Car price 2 field must be a positive value greater than 0"
    }
    else if(carPrice3 < 0) {
      errors.carPrice3 = " Car price 3 field must be a positive value greater than 0"
    }
    if(carPrice1 !== '' && carPrice2 !== '' && carPrice3 !== '' && carPrice1 > 0 && carPrice2 > 0 && carPrice3 > 0) {
      prices.push(carPrice1, carPrice2, carPrice3)
      this.setState({ prices, current: 'milesPerGallonContent', displayTable: {} })      
    } else {
      this.setState({ errors })
    }
  }

  calculateMPGCost = (e) => {
    e.preventDefault()
    let {
      mpgTableArray,
      milesPerGallon,
      milesDriven,
      costPerGallon,
      prices,
      errors,
      tabsIndex,
      tabs
    } = this.state
    if(milesPerGallon === '') {
      errors.milesPerGallon = " Miles per gallon field cannot be empty"
    }
    if(milesPerGallon < 0) {
      errors.milesPerGallon = " Miles per gallon field must be a value greater than 0"
    }
    if(milesPerGallon !== '' && milesPerGallon > 0) {
      prices = prices.map((price, i) => {
        const total = Math.round(Number(price) + ((Number(milesDriven) / Number(milesPerGallon)) * Number(costPerGallon)))
        let perMile = total / Number(milesDriven)
        perMile.toFixed(2)
        return {
          total, perMile
        }
      })
      tabsIndex.push({
        elem: tabs
      })
      mpgTableArray.push({
        value: milesPerGallon,
        totals: prices
      }) // After finishing the above calculations, append the values to the table array
      this.setState({
        mpgTableArray,
        milesPerGallon: ''
      })
    } else {
      this.setState({ errors })
    }
  }

  onSelect = selectedIndex =>  {
    this.setState({ tabStyle: 'tabPanel leave' })
    setTimeout(() => this.setState({ 
      selectedIndex, 
      tabStyle: 'tabPanel' 
    }), 250)
  }

  removeItem = index => {
    const { tabsIndex } = this.state
    tabsIndex.splice(index, 1)
    this.setState({ tabsIndex, selectedIndex: index - 1 })
    localStorage['tabsIndex'] = JSON.stringify([...this.state.tabsIndex])
  }

  removeAll = () => { 
    this.setState({ tabsIndex: [] }) 
    localStorage['tabsIndex'] = '[]'
  }

  render() {
    // Home content which has container for the first options for miles/fuel price
    const home = (
      <div className="formContainer">
        <h1 className="d-flex justify-content-center">Dynamic Car Comparator</h1>
        <hr/>
        <form className="formContent">
          <div className="form-group">
            <label htmlFor="milesDriven">Expected Miles Driven</label>
            <input 
              type="number" 
              onChange={this.onChange} 
              value={this.state.milesDriven} 
              className="form-control" 
              name="milesDriven"/>
            {this.state.errors.milesDriven && <span>{this.state.errors.milesDriven}</span>}
            <br/>
            <InputRange
              value={this.state.milesDriven === '' ? 1 : Number(this.state.milesDriven)}
              onChange={milesDriven => this.setState({ milesDriven })}
              formatLabel={milesDriven => `${new Intl.NumberFormat().format(milesDriven)}`}
              step={1}
              minValue={1}
              maxValue={100000}/>
          </div>
          <br/>
          <div className="form-group">
            <label htmlFor="costPerGallon">Gas Price ($)</label>
            <input 
              type="number" 
              onChange={this.onChange} 
              value={this.state.costPerGallon} 
              className="form-control" 
              name="costPerGallon"/>
            {this.state.errors.costPerGallon && <span>{this.state.errors.costPerGallon}</span>}
            <br/>
            <InputRange
              value={this.state.costPerGallon === '' ? 1 : Number(this.state.costPerGallon)}
              onChange={costPerGallon => this.setState({ costPerGallon })}
              formatLabel={costPerGallon => `${new Intl.NumberFormat().format(costPerGallon)}`}
              step={1}
              minValue={1}
              maxValue={25}/>
          </div>
          <div className="d-flex justify-content-center">
            <Button onClick={this.home} raised>Next</Button>
          </div>
        </form>
      </div>
    )
    // Car content which has container for the car prices
    const carPricesContent = (
      <div className="carPricesContainer">
        <h3 className="d-flex justify-content-center">Please enter 3 different car prices: </h3>
        <form className="carPricesContent">
          <div className="form-group">
            <label htmlFor="carPrice1">Car Price: 1 ($)</label>
            <input 
              type="number" 
              onChange={this.onChange} 
              value={this.state.carPrice1} 
              className="form-control" 
              name="carPrice1"/>
            {this.state.errors.carPrice1 && <span>{this.state.errors.carPrice1}</span>}
            <br/>
            <InputRange
              value={this.state.carPrice1 === '' ? 1 : Number(this.state.carPrice1)}
              onChange={carPrice1 => this.setState({ carPrice1 })}
              formatLabel={carPrice1 => `${new Intl.NumberFormat().format(carPrice1)}`}
              step={1}
              minValue={1}
              maxValue={100000}/>
          </div>
          <br/>
          <div className="form-group">
            <label htmlFor="carPrice2">Car Price: 2 ($)</label>
            <input 
              type="number" 
              onChange={this.onChange} 
              value={this.state.carPrice2} 
              className="form-control" 
              name="carPrice2"/>
            {this.state.errors.carPrice2 && <span>{this.state.errors.carPrice2}</span>}
            <br/>
            <InputRange
              value={this.state.carPrice2 === '' ? 1 : Number(this.state.carPrice2)}
              onChange={carPrice2 => this.setState({ carPrice2 })}
              formatLabel={carPrice2 => `${new Intl.NumberFormat().format(carPrice2)}`}
              step={1}
              minValue={1}
              maxValue={100000}/>
              <br/>
          </div>
          <div className="form-group">
            <label htmlFor="carPrice3">Car Price: 3 ($)</label>
            <input 
              type="number" 
              onChange={this.onChange} 
              value={this.state.carPrice3} 
              className="form-control" 
              name="carPrice3"/>
            {this.state.errors.carPrice3 && <span>{this.state.errors.carPrice3}</span>}
            <br/>
            <InputRange
              value={this.state.carPrice3 === '' ? 1 : Number(this.state.carPrice3)}
              onChange={carPrice3 => this.setState({ carPrice3 })}
              formatLabel={carPrice3 => `${new Intl.NumberFormat().format(carPrice3)}`}
              step={1}
              minValue={1}
              maxValue={100000}/>
          </div>
          <div className="d-flex justify-content-center">
            <Button onClick={this.calculateCarPrices} raised>Next</Button>
          </div>
        </form>
      </div>
    )
    // MPG container which has the calculate for different MPG for the table array
    const milesPerGallonContent = (
    <div className="mpgContainer">
      <h3 className="d-flex justify-content-center">Please enter the MPG you would like compared: </h3>
      <form className="mpgContent" onSubmit={this.calculateMPGCost}>
        <div className="form-group">
          <label htmlFor="milesPerGallon">Miles Per Gallon</label>
          <input 
            type="number" 
            onChange={this.onChange} 
            value={this.state.milesPerGallon} 
            className="form-control" 
            name="milesPerGallon"/>
          {this.state.errors.milesPerGallon && <span>{this.state.errors.milesPerGallon}</span>}
          <br/>
          <InputRange
            value={this.state.milesPerGallon === '' ? 1 : Number(this.state.milesPerGallon)}
            onChange={milesPerGallon => this.setState({ milesPerGallon })}
            formatLabel={milesPerGallon => `${new Intl.NumberFormat().format(milesPerGallon)}`}
            step={1}
            minValue={1}
            maxValue={50}/>
        </div>
        <div className="d-flex justify-content-center">
          <Button onClick={this.calculateMPGCost} raised>Submit</Button>
        </div>
      </form>
    </div>
    )

    return (
      <div className="App">
        {/* Contains the current states of the page, each time you press next the page state is updated */}
        <div className="jumbotron container">
          <div className="container">
            {this.state.current === 'home' && home}
            {this.state.current === 'carPricesContent' && carPricesContent}
            {this.state.current === 'milesPerGallonContent' && milesPerGallonContent}
          </div>
        </div>
        {/* Updated state of the page shows the table for viewing */}
        <div className="card container" style={this.state.displayTable}>
          {/* Table key */}
          <div className="card-body">
            <h3 className="d-flex justify-content-center">Car Price vs Cost per Mile Table</h3>
            <hr/>
            <div className="card-text d-flex justify-content-center">The results are displayed in the table as [total car price / cost per mile]</div>
          </div>
          {/* Outter table values (Horizontally the price) */}
          <Tabs 
              selectedIndex={this.state.selectedIndex} 
              onSelect={selectedIndex => this.onSelect(selectedIndex) }
              selectedTabClassName='selectedTab'>
              <TabList>
                {this.state.tabsIndex.map((tabs, key) => {
                  return <Tab key={key}>Tab {key + 1}</Tab>
                })}
              </TabList>
              {this.state.tabsIndex.map((tabs, key) => {
                return <TabPanel key={key}>
                <h3>Table {key + 1}</h3>
                <table className="table table-bordered table-hover">
                  <tbody>
                    <tr>
                      <th className="blank">Cost/MPG</th>
                      {
                        this.state.prices.map((price, i) => {
                          return (<th>${price}</th>)
                        })
                      }
                    </tr>
                    {
                      // Inner table values (vertically the MPG)
                      this.state.mpgTableArray.map((milesPerGallon, i) => {
                        return (
                          <tr>
                            <th>{milesPerGallon.value} MPG</th>
                            {
                              milesPerGallon.totals.map((total, i) => {
                                return (
                                  <td className="total">${total.total} / ${total.perMile.toFixed(2)}</td>
                                )
                              })
                            }
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                <span onClick={() => this.removeItem(key)} className='removeButton'>
                  &times; Remove
                </span>&emsp;
                {this.state.prices.length > 1 && 
                  <span onClick={this.removeAll} className='removeButton'>
                    &times; Remove All
                  </span>
                }
                </TabPanel>
              })}
            </Tabs>
          {/* <table className="table table-bordered table-hover">
            <tbody>
              <tr>
                <th className="blank">Cost/MPG</th>
                {
                  this.state.prices.map((price, i) => {
                    return (<th>${price}</th>)
                  })
                }
              </tr>
              {
                // Inner table values (vertically the MPG)
                this.state.mpgTableArray.map((milesPerGallon, i) => {
                  return (
                    <tr>
                      <th>{milesPerGallon.value} MPG</th>
                      {
                        milesPerGallon.totals.map((total, i) => {
                          return (
                            <td className="total">${total.total} / ${total.perMile.toFixed(2)}</td>
                          )
                        })
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table> */}
        </div>
      </div>
    );
  }
}

export default App;