import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import {firebase} from '../../../libs/config/firebase';
import {convertTime} from '../../../libs/config/convertTime';
import {Input, Form, Item, CardItem, Card, Left, Icon, Body} from 'native-base';
import {color} from '../../../component/baseColor';
import {FlatList} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';

const {width} = Dimensions.get('window');

const Room = (props) => {
  const paramsProps = props.route.params;
  const isFocused = useIsFocused();
  const [message, setMessage] = useState(null);
  const [messageData, setMessageData] = useState([]);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (isFocused) {
      getMessage();
    }
  }, [props, isFocused]);

  const onChangeMessage = (value) => {
    setMessage(value);
  };

  const getMessage = async () => {
    const currentUser = firebase.auth().currentUser;
    let userName = currentUser.displayName;
    let partnerUserName = paramsProps.name;
    let conn = firebase.database();

    let messagedata = conn.ref('message/' + userName + '/' + partnerUserName);
    let updateRead = {};

    messagedata.on('value', (data) => {
      const result = [];
      data.forEach(async (el) => {
        let file = null;
        if (el.val().file) {
          file = await getFile(el.val().file);
        }

        result.push({
          _id: el.key,
          message: el.val().message,
          from: el.val().from,
          to: el.val().to,
          time: el.val().time,
          see: el.val().see,
          ...(file && {file}),
          ...result,
        });

        if (
          paramsProps.name === el.val().fromName &&
          currentUser.displayName !== el.val().fromName &&
          isFocused
        ) {
          if (!el.val().see) {
            updateRead[
              'message/' +
                paramsProps.name +
                '/' +
                el.val().toName +
                '/' +
                el.key
            ] = {
              see: true,
              from: el.val().from,
              fromName: el.val().fromName,
              message: el.val().message,
              time: el.val().time,
              to: el.val().to,
              toName: paramsProps.name,
            };
          }
        } else {
          updateRead = {};
        }
      });

      setMessageData(result);

      try {
        firebase.database().ref().update(updateRead);
        updateRead = {};
      } catch (error) {
        console.log(error);
      }
    });
  };

  const getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.addEventListener('load', function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  sendFile = (file) => {
    const storageRef = firebase
      .storage()
      .ref('uploads/chat/image/' + file.fileName);

    getFileBlob(file.uri, (blob) => {
      const promiseFileName = new Promise(function (resolve, rejected) {
        storageRef
          .put(blob, {
            contentType: 'image/jpeg',
          })
          .then((snapshot) => {
            resolve(snapshot.metadata.name);
          })
          .catch((error) => {
            console.log('error', error);
          });
      });

      promiseFileName.then((img) => {
        uplaodMessage(img);
        setImageUri(null);
      });
    });
  };

  const getFile = async (filename) => {
    const getFileRef = await firebase
      .storage()
      .ref('uploads/chat/image/' + filename)
      .getDownloadURL();

    return getFileRef;
  };

  const sendMessage = async () => {
    if (imageUri !== null) {
      sendFile(imageUri);
    } else uplaodMessage();
  };

  const uplaodMessage = (file = null) => {
    const currentUser = firebase.auth().currentUser;
    let userName = currentUser.displayName;
    let partnerUserName = paramsProps.name;
    let db = firebase.database();
    let messageId = db
      .ref('message')
      .child(userName)
      .child(partnerUserName)
      .push().key;

    const messageDef = {
      message: message ? message : 'image',
      from: currentUser.email,
      to: paramsProps.email,
      toName: paramsProps.name,
      fromName: currentUser.displayName,
      see: false,
      time: firebase.database.ServerValue.TIMESTAMP,
      ...(file && {file}),
    };

    let dataSend = {};

    dataSend[
      'message/' + partnerUserName + '/' + userName + '/' + messageId
    ] = messageDef;

    dataSend[
      'message/' + userName + '/' + partnerUserName + '/' + messageId
    ] = messageDef;

    try {
      db.ref().update(dataSend);
      setMessage(null);
      dataSend = {};
      getMessage();
    } catch (error) {
      console.log(error);
    }
  };

  const chooseFile = async () => {
    const options = {
      title: 'Select Avatar',
      maxWidth: 600,
      maxHeight: 600,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response);
      }
    });
  };

  const getDayliTimeMessage = (currentTime, index) => {
    if (index) {
      if (
        convertTime(currentTime) !== convertTime(messageData[index - 1].time) &&
        convertTime(currentTime).length > 5
      ) {
        return (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                backgroundColor: '#039A54',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}>
              <Text style={{color: '#fff'}}>{convertTime(currentTime)}</Text>
            </View>
          </View>
        );
      }
    }
  };

  const getMessageinfo = (item) => {
    return (
      <View style={styles.view.chatView.selfMessage.timeGroup}>
        <Text style={styles.view.chatView.selfMessage.timeGroup.time}>
          {convertTime(item.time)}
        </Text>
        {item.to === paramsProps.email && (
          <Icon
            type="FontAwesome5"
            name={!item.see ? 'check' : 'check-double'}
            style={styles.view.chatView.selfMessage.timeGroup.icon}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.view}>
      <Card style={styles.view.card}>
        <CardItem style={styles.view.cardItem}>
          <TouchableOpacity
            onPress={() => props.navigation.dispatch(CommonActions.goBack())}>
            <Icon
              name="arrowleft"
              type="AntDesign"
              style={styles.view.cardItem.icon}
            />
          </TouchableOpacity>

          <Left>
            <Image
              source={{
                uri:
                  'https://images.unsplash.com/photo-1578146059353-7bd5f5b644ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80',
              }}
              style={styles.view.card.image}
            />
            <Body>
              <Text style={styles.view.card.name}>{paramsProps.name}</Text>
              <View style={styles.view.card.notion}>
                <View style={styles.view.card.notion.activityNotion}></View>
                <View>
                  <Text style={styles.view.card.notion.activity}>Online</Text>
                </View>
              </View>
            </Body>
          </Left>
          <Icon
            name="phone"
            type="SimpleLineIcons"
            style={styles.view.cardItem.iconPhone}
          />
          <Icon
            name="ellipsis-v"
            type="FontAwesome5"
            style={styles.view.cardItem.icon}
          />
        </CardItem>
      </Card>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.view.chatView}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={messageData}
            keyExtractor={(_, index) => 'key' + index}
            numColumns={1}
            renderItem={({item, index}) => {
              return (
                <View key={index}>
                  {getDayliTimeMessage(item.time, index)}
                  {item.file !== undefined && (
                    <View>
                      <Image
                        source={{uri: item.file}}
                        style={{
                          width: 279,
                          height: 219,
                          resizeMode: 'cover',
                          borderRadius: 20,
                          alignSelf: 'flex-end',
                          display: 'flex',
                          backgroundColor: 'red',
                          marginBottom: 20,
                        }}
                      />
                      {getMessageinfo(item)}
                    </View>
                  )}
                  <View
                    style={
                      item.to !== paramsProps.email
                        ? styles.view.chatView.partnerChat
                        : styles.view.chatView.selfMessage
                    }>
                    <View
                      style={
                        item.to !== paramsProps.email
                          ? styles.view.chatView.partnerChat.balonChat
                          : styles.view.chatView.selfMessage.balonChat
                      }>
                      <Text
                        style={
                          item.to !== paramsProps.email
                            ? styles.view.chatView.partnerChat.message
                            : styles.view.chatView.selfMessage.message
                        }>
                        {item.message}
                      </Text>
                    </View>
                    {getMessageinfo(item)}
                  </View>
                </View>
              );
            }}
          />
        </View>
        <Form
          style={{
            position: 'absolute',
            bottom: 0,
            width: width,
            zIndex: 999,
            backgroundColor: '#F2FFF9',
          }}>
          <Item last>
            <Input
              value={message}
              placeholder="Your Message"
              onChangeText={(e) => onChangeMessage(e)}
            />
            <TouchableOpacity onPress={chooseFile}>
              <Icon
                type="FontAwesome"
                name="image"
                style={styles.view.iconImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendMessage}
              // disabled={message === '' || message === ' ' || message === null}
            >
              <Icon
                type="FontAwesome5"
                name="paper-plane"
                style={styles.view.icon}
              />
            </TouchableOpacity>
          </Item>
        </Form>
      </SafeAreaView>
    </View>
  );
};
const styles = {
  view: {
    flexDirection: 'column',
    backgroundColor: '#F2FFF9',
    flex: 1,
    card: {
      elevation: 0,
      borderColor: '#fff',
      image: {
        width: 50,
        height: 50,
        borderRadius: 50,
      },
      name: {
        fontSize: 14,
      },
      notion: {
        display: 'flex',
        flexDirection: 'row',
        activityNotion: {
          width: 10,
          height: 10,
          backgroundColor: color.green,
          borderRadius: 50,
          marginRight: 3,
        },
        activity: {
          fontSize: 8,
        },
      },
    },
    cardItem: {
      backgroundColor: '#F2FFF9',
      icon: {
        fontSize: 20,
        fontWeight: 200,
        color: '#757575',
      },
      iconPhone: {
        marginRight: 10,
        fontSize: 20,
        fontWeight: 200,
        color: '#757575',
        transform: [{rotate: '260deg'}],
        marginTop: -10,
      },
    },
    chatView: {
      marginLeft: 28,
      marginRight: 28,
      paddingBottom: 50,
      position: 'relative',
      // selfMessageImg: {
      //   alignSelf: 'flex-end',
      // },
      selfMessage: {
        alignSelf: 'flex-end',
        marginBottom: 25,
        balonChat: {
          minwidth: 10,
          minHeight: 10,
          maxWidth: 300,
          padding: 18,
          backgroundColor: color.green,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 3,
        },
        message: {
          color: '#fff',
        },
        timeGroup: {
          display: 'flex',
          flexDirection: 'row',
          marginTop: 3,
          time: {
            fontSize: 7,
            marginRight: 10,
          },
          icon: {
            fontSize: 7,
            position: 'absolute',
            right: 0,
            color: color.green,
          },
        },
      },

      partnerChat: {
        alignSelf: 'flex-start',
        marginBottom: 25,
        balonChat: {
          minwidth: 10,
          minHeight: 10,
          maxWidth: 300,
          padding: 18,
          backgroundColor: color.light,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 25,
        },
        message: {
          color: '#000',
        },
        timeGroup: {
          display: 'flex',
          flexDirection: 'row',
          marginTop: 3,
          time: {
            fontSize: 7,
            marginRight: 10,
          },
          icon: {
            fontSize: 7,
            position: 'absolute',
            right: 0,
            color: color.green,
          },
        },
      },
    },
    icon: {
      marginRight: 20,
      marginTop: 20,
      marginBottom: 20,
      fontSize: 20,
      color: color.green,
      transform: [{rotate: '20deg'}],
    },
    iconImage: {
      // margin: 20,
      fontSize: 20,
      color: color.green,
      // transform: [{rotate: '20deg'}],
    },
  },
};
export default Room;
