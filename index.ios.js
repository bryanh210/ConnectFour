import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Alert,
  AsyncStorage,
  MapView,
  Image
} from 'react-native'

// This is the root view
var Connect4 = React.createClass({
  render() {
    return (
      <NavigatorIOS
      initialRoute={{
        component: FrontPage,
        title: "Xin Chào!"
      }}
      style={{flex: 1}}
      />
    );
  }
});

var Interface= React.createClass({
  getInitialState() {
    // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //
    // fetch('https://hohoho-backend.herokuapp.com/messages', {
    //   method: 'GET',
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    // })
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   console.log(responseJson)
    //   this.setState({
    //     dataSource: ds.cloneWithRows(responseJson.messages)
    //   })
    // })
    return{
      initialRow: ["🐳","🐼","🐸","🐙","🐨","🐤","🐩"],
      dataSource: [["0","0","0","0","0","0","0"],
      ["0","0","0","0","0","0","0"],
      ["0","0","0","0","0","0","0"],
      ["0","0","0","0","0","0","0"],
      ["0","0","0","0","0","0","0"],
      ["0","0","0","0","0","0","0"],
      ["0","0","0","0","0","0","0"]]
    }
  },

  render(){
    return (

      <View style={styles.container}>
      <Image style={styles.backgroundImage} source={{uri: 'https://s-media-cache-ak0.pinimg.com/originals/ac/99/13/ac991305df5fb4c1cdd53bf7f5535a4e.gif'}}/>
      <Text style={styles.textBig}> Current Turn:</Text>
      <TouchableOpacity>
      <Text>{this.state.initialRow.map((panda)=>
      <Text style={styles.roundbutton}>{panda}</Text>)}
      </Text>
      </TouchableOpacity>
      {this.state.dataSource.map((row)=>
      <Text style={styles.grid}>{row.map((item) =>
      <Text>{item}</Text>)}
      </Text>)}
      </View>

      // <Text style={styles.textBig}> Current Turn:</Text>
      // {this.state.dataSource.map((row)=>
      // <Text>{row}</Text>)

      // <View style={styles.container}>
      // <Text style={styles.textBig}>Login to the game, playa!</Text>
      // <TouchableOpacity onPress={this.login} style={[styles.button, styles.buttonRed]}>
      // <Text style={styles.buttonLabel}>Tap to Login</Text>
      // </TouchableOpacity>
      // <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={this.register}>
      // <Text style={styles.buttonLabel}>Tap to Register</Text>
      // </TouchableOpacity>
      // </View>

    )
  }
})


var Games = React.createClass({
  getInitialState() {

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
      // body: JSON.stringify({
      //   username: this.state.username,
      //   password: this.state.password,
      // })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      })
    })
    return{
      dataSource: ds.cloneWithRows([]),
    }
  },



  render(){
    return (
      <View style={styles.container}>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <View style={styles.container}>
      <Text>{rowData.username} : {rowData.score}</Text>
      </View>} />
      </View>
    )
  },
})


var Register = React.createClass({

  getInitialState () {
    return {
      username: '',
      password: ''
    }
  },

  press(){

    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('EYYY: ', responseJson);
      if(responseJson.success === true){
        console.log('Success!');
      }

      console.log(this.state.username, this.state.password)
      this.props.navigator.pop()
    })
    /* do something with responseJson and go back to the Login view but
    * make sure to check for responseJson.success! */
    .catch((err) => {
      console.log('urr boooooi', err);
    });
  },

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Register</Text>
      <TextInput
      style={{height: 40}}
      placeholder="Enter your username"
      onChangeText={(text1) => this.setState({username: text1})}/>

      <TextInput secureTextEntry={true}
      style={{height: 40}}
      placeholder="Enter your password"
      onChangeText={(text2) => this.setState({password: text2})}/>

      <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonPink]}>
      <Text>Register ho!</Text>
      </TouchableOpacity>
      </View>
    );
  }
});


var Login = React.createClass({
  getInitialState () {
    return {
      username: '',
      password: ''
    }
  },
  interface(){
    this.props.navigator.push({
      component: Interface,
      title: "Game On"
    })
  },

  press(username,password){
    // var self = this;

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.navigator.push({
        component: Games,
        title: "Games",
        passProps: {
          username: this.state.username,
          password: this.state.password
        },
        rightButtonTitle: 'Interface',
        onRightButtonPress: this.interface
      })
      console.log('storing ', this.state.username, this.state.password);
      AsyncStorage.setItem('user', JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }));


    })
    /* do something with responseJson and go back to the Login view but
    * make sure to check for responseJson.success! */
    .catch((err) => {
      console.log('LOGIN ERROR BOOOI', err);
    });
  },

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Log In</Text>
      <TextInput
      style={{height: 40}}
      placeholder="Login Username"
      onChangeText={(text1) => this.setState({username: text1})}/>

      <TextInput secureTextEntry={true}
      style={{height: 40}}
      placeholder="Login Password"
      onChangeText={(text2) => this.setState({password: text2})}/>

      <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonYellow]}>
      <Text>Login ho!</Text>
      </TouchableOpacity>
      </View>
    );
  }

});


var FrontPage = React.createClass({
  componentDidMount(){
    console.log('eyyy1');
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      console.log(result, username, password);
      if (username && password) {
        console.log('You got it mate!', this.props.navigator)
        this.props.navigator.push({
          component: Games,
          title: "Games",
          passProps: {
            username: username,
            password: password
          },
          rightButtonTitle: 'Interface',
          onRightButtonPress: this.interface
        });
      }
    })
    .catch(err => console.log(err))
  },

  interface(){
    this.props.navigator.push({
      component: Interface,
      title: "Game in session"
    });
  },

  login() {
    this.props.navigator.push({
      component: Login,
      title: "Login"
    });
  },

  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  },

  render() {
    return (
      <View style={styles.container}>
      <Image style={styles.backgroundImage} source={{uri: 'https://data.whicdn.com/images/35234739/original.gif'}}/>
      <Text style={styles.textOpacity}>Time to play the GAME</Text>
      <TouchableOpacity onPress={this.login} style={[styles.button, styles.buttonRed]}>
      <Text style={styles.buttonLabel}>Tap to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={this.register}>
      <Text style={styles.buttonLabel}>Tap to Register</Text>

      </TouchableOpacity>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  textOpacity:{
    opacity: 0.8,
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
    // backgroundColor: 'transparent',
    // color: 'white'
  },

  backgroundImage:{
    position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        resizeMode: 'stretch',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
    opacity: 0.85
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonPink:{
    backgroundColor: 'pink'
  },
  buttonYellow:{
    backgroundColor: 'yellow'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },

grid:{
  // flex:1,
  // width:1,
  // height:1,
  // backgroundColor: 'yellow',
  borderWidth:1,
  borderColor: '#000',
  fontSize: 40,
  opacity: 0.75
},

roundbutton:{
    backgroundColor: "transparent",
    borderColor: '#000',
    fontSize: 20,
    opacity: 0.75
},

  });






AppRegistry.registerComponent('Connect4', () => Connect4 );
