import React from "react";
import Header from "../../common/header/Header";
import "./Search.css";
import TableData from "../buspage/BuslistTable";
import bushistoryjson from "../../resources/bushistory.json";
import { getBusdetails } from "../../service/service";
import Swal from "sweetalert2";
import { userContext } from "../../context/Context";
import Menu from "../../common/menu/Menu";
import axios from 'axios'


class Search extends React.Component {
  static contextType = userContext;
  constructor() {
    super();
    this.state = {
      visible: false,
      value: "",
      tovalue: "",
      dateVal:"",
      button: false,
      showsearch: true,
      busData:[]
      
    };
    this.showSource = this.showSource.bind(this);
    this.ShowtoValue = this.ShowtoValue.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.showTable = this.showTable.bind(this);
  }
  showSource(e) {
    {
      this.setState({
        value: e.target.value,
      });
    }
  }

  ShowtoValue(e) {
    if (e.target.value !== this.state.value) {
      this.setState({
        tovalue: e.target.value,
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "ohh!!",
        text: "source and destination should not be same...",
      });
    }
  }
  dateChange(e) {
    this.setState({
      dateVal: e.target.value,
    });
  }

  showTable(e) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    if (
      this.state.value === "" &&
      this.state.tovalue === "" &&
      this.state.dateVal === ""
    ) {
      e.preventDefault();

      this.setState({ button: false });
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "You haven't entered any values to search",
      });
    } else if (this.state.value === "") {
      e.preventDefault();

      this.setState({ button: false });
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "You haven't entered the source!!",
      });
    } else if (this.state.tovalue === "") {
      e.preventDefault();

      this.setState({ button: false });
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "You haven't entered the destination!!",
      });
    } else if (this.state.dateVal === "") {
      e.preventDefault();

      this.setState({ button: false });
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "You haven't entered the date!!",
      });
    } else if (this.state.dateVal < today) {
      e.preventDefault();

      this.setState({ button: false });
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "You have entered the expired date!!",
      });
    } else {
      this.setState({
        showsearch: false,
      });
      let searchDetails={
        from : this.state.value,
        to:this.state.tovalue
      }
    
    this.search(searchDetails)
    .then((response) => response.data)
    .then((data) => {
      let { token } = data;
      sessionStorage.setItem("busDetails", JSON.stringify(data));
      sessionStorage.setItem("date",this.state.dateVal)
      console.log(data)
      if(sessionStorage.getItem("busDetails"))
      {
        console.log("stored")
        console.log(data)
        this.setState({
          busData:data,
          button:true,
          
        })
      }
      });
    }
  }

  search(searchDetails) {
    let apiUrl = "http://localhost:5000/users/search";
    return axios.post(apiUrl,searchDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  componentDidMount()
  {

    let storedSearchdetails, from, to, dateval;
   
    if (sessionStorage.getItem("searchdetails")) {
      storedSearchdetails = JSON.parse(sessionStorage.getItem("searchdetails"));
      from = storedSearchdetails.from;
      to = storedSearchdetails.to;
      dateval = storedSearchdetails.date;
      this.setState({
        value:from,
        tovalue:to,
        dateVal:dateval
      })
    }
  
   
  }


  render() {
    
    const toList = [" ", "Chennai", "Madurai", "Trichy"];
    let prevId, prevuserId, searchDetails, busDetails, getBusdata, id, userId;
    let seats, busNo, fare, busName, from, to, type, button;
    let toVal;
    let storedDetails;
    bushistoryjson.userbusbooking.filter((element) => {
      prevId = parseInt(element.id);
      prevuserId = element.userid;
    });
    getBusdata = [getBusdetails(this.state.value, this.state.tovalue)];
    id = prevId + 1;
    userId = prevuserId + 1;
    searchDetails = {
      from: this.state.value,
      to: this.state.tovalue,
      date: this.state.dateVal,
      id: id,
      userid: userId,
    };
    getBusdata.filter(function (element) {
      seats = element.NoOfSeats;
      busNo = element.busno;
      fare = element.fare;
      busName = element.busname;
      type = element.type;
      from = element.from;
      to = element.to;
      button = element.button;
      return getBusdata;
    });
    busDetails = {
      NoOfSeats: seats,
      busno: busNo,
      fare: fare,
      busname: busName,
      from: from,
      to: to,
      date: this.state.dateVal,
      type: type,
      button: button,
    };
    // if (localStorage.getItem("searchdetails")) {
    //   storedDetails = JSON.parse(localStorage.getItem("searchdetails"));
    // }
    toVal = toList.filter((value) => {
      return value !== this.state.value;
    });
    return (
      <div>
       <Header/>
        <Menu />
        <div class="searchContainer">
          <div class="FromCol">
            <label>
              {" "}
              From{" "}
              <select
                class="From"
                value={this.state.value}
                onChange={this.showSource}
              >
                <option value="">{""}</option>
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
                <option value="Trichy">Trichy</option>
              </select>
            </label>
            <label>
              {""}
              To{""}
              <select
                class="From"
                value={this.state.tovalue}
                onChange={this.ShowtoValue}
              >
                {toVal.map((to) => (
                  <option value={to.value}> {to === "" ? "" : to}</option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                class="frominput"
                placeholder="Date"
                value={this.state.dateVal}
                onChange={this.dateChange}
              ></input>
            </label>{" "}
            <button class="buttonclass" onClick={this.showTable}>
              Search
            </button>
          </div>
        </div>

        {this.state.button &&
          sessionStorage.setItem("searchdetails", JSON.stringify(searchDetails))}
        {this.state.button && <TableData busData={this.state.busData}/>}
        {this.state.button &&
          sessionStorage.setItem("busdetails", JSON.stringify(busDetails))}
        {sessionStorage.getItem("searchdetails") ? <TableData busData={this.state.busData}/> : null}
      </div>
    );
  }
}

export default Search;
