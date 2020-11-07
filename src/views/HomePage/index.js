import React, {useEffect, useState} from 'react';
import {Text, Dimensions, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

/** Component **/
import {color} from '../../component/baseColor';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from '../../component';
import List from '../Chat/list';
import {Button} from 'native-base';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
    };
  }

  retriveData = async () => {
    const val = await AsyncStorage.getItem('name');
    this.setState({
      displayName: val,
    });
  };

  UNSAFE_componentWillMount() {
    // console.log('update');

    this.retriveData();
  }

  render() {
    return (
      <View style={styles.view}>
        <Header />

        <View style={styles.header.menu}>
          <View style={styles.header.menu.story}>
            <Text style={styles.header.menu.story.text}>Story</Text>
          </View>
          <View style={styles.header.menu.contact}>
            <TouchableOpacity
              style={styles.header.menu.contact.text}
              transparent
              onPress={() => this.props.navigation.navigate('Contact')}>
              <Text>Contact</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.header.menu.other}>
            <Icon name="ellipsis-v" style={styles.header.menu.other.icon} />
          </View>
        </View>

        <Button
          primary
          rounded
          style={styles.addContact}
          onPress={() => this.props.navigation.navigate('Contact')}>
          <Icon name="plus" style={styles.addContact.icon} />
        </Button>

        <View style={styles.chatList}>
          <List navigation={this.props.navigation} stored={this.state} />
        </View>
      </View>
    );
  }
}

const styles = {
  view: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: 'column',
    backgroundColor: '#F2FFF9',
  },
  chatList: {
    position: 'absolute',
    width: windowWidth,
    top: 90,
  },
  header: {
    menu: {
      flex: 1,
      flexDirection: 'row',
      position: 'absolute',
      right: 0,
      marginTop: 28,
      marginRight: 28,
      story: {
        backgroundColor: color.green,
        width: 65,
        borderRadius: 50,
        text: {
          paddingRight: 7,
          paddingLeft: 7,
          paddingTop: 4,
          paddingBottom: 4,
          textAlign: 'center',
          color: 'white',
          fontSize: 14,
        },
      },
      contact: {
        width: 65,
        text: {
          paddingRight: 7,
          paddingLeft: 7,
          paddingTop: 4,
          paddingBottom: 4,
          textAlign: 'center',
          textAlign: 'center',
          color: 'black',
          fontSize: 14,
        },
      },
      other: {
        width: 10,
        icon: {
          textAlign: 'center',
          fontSize: 14,
          paddingTop: 6,
        },
      },
    },
  },
  addContact: {
    width: 50,
    height: 50,
    backgroundColor: color.green,
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 20,
    marginBottom: 20,
    flex: 1,
    icon: {
      color: '#fff',
      fontSize: 25,
    },
  },
};

export default SignIn;
