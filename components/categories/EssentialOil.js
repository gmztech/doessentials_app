import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  FlatList,
  Share,
} from 'react-native';
import firebase from '../../firebase/firebase';
import colors from '../../assets/colors/colors';
import ActionBar from '../common/ActionBar';
import gs from '../../assets/css/GeneralStyles';
import Intro from '../common/Intro';
import SearchInput from '../common/SearchInput';
import {useGlobalState} from 'state-pool';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
MaterialCommunityIcons.loadFont();
Feather.loadFont();

import {Dimensions} from 'react-native';
import Item from './ListItem';
import AssignConsultModal from './AssignConsultModal';
const vh = percent => (Dimensions.get('window').height * percent) / 100;

const EssentialOil = ({route, navigation}) => {
  const mountedRef = useRef(true);
  const {item: subcategory, mainCategory} = route.params;
  const [itemList, setItemlist] = useState(subcategory.items);
  const [client] = useGlobalState('client');
  const [savedItems, setSavedItems] = useState(client.mySaves);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);
  const [toggleDescription, setToggleDescription] = useState(false);
  const [showAssignConsultModal, setShowAssignConsultModal] = useState(false);

  const sortAlphabetically = items =>
    items.sort((a, b) =>
      (a.title || a.description || '').localeCompare(
        b.title || b.description || '',
      ),
    );

  if (subcategory.type !== 'bullets') {
    subcategory.items = sortAlphabetically(subcategory.items);
  }

  const filterItems = text => {
    let filteredItems = subcategory.items.filter(
      li =>
        (li.title && li.title.toLowerCase().indexOf(text.toLowerCase()) > -1) ||
        (li.description &&
          li.description.toLowerCase().indexOf(text.toLowerCase()) > -1),
    );

    if (subcategory.type !== 'bullets') {
      filteredItems = sortAlphabetically(filteredItems);
    }

    if (!text.length) {
      filteredItems = subcategory.items;
    }
    setItemlist(filteredItems);
  };

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setSavedItems(client.mySaves);
    return () => {
      mountedRef.current = false;
    };
  }, [client]);

  const saveItem = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const clientRef = firebase.firestore().collection('clients').doc(client.id);
    let newItems;
    if (itemExist()) {
      newItems = (savedItems || []).filter(
        si => si.path !== `${mainCategory.id}/${subcategory.id}`,
      );
    } else {
      newItems = [
        ...(savedItems || []),
        {
          created: Date.now(),
          mainCategory: {...mainCategory, items: []},
          subcategory: {...subcategory},
          path: `${mainCategory.id}/${subcategory.id}`,
        },
      ];
    }
    await clientRef.set({mySaves: newItems}, {merge: true});
    setLoading(false);
  };

  const itemExist = () => {
    return (savedItems || []).some(
      i => i.path === `${mainCategory.id}/${subcategory.id}`,
    );
  };

  const share = () => {
    Share.share({
      title: 'Compartir',
      message: `${subcategory.title}\n\n${itemList
        .map(i => i.description)
        .join('\n')}`,
    });
  };

  const toggleShowAssignConsultModal = () => {
    setPath({
      mainCategory: removeItems(mainCategory),
      subcategory: removeItems(subcategory),
      path: `${mainCategory.id}/${subcategory.id}`,
    });
    setShowAssignConsultModal(!showAssignConsultModal);
  };

  const listHeight = () => {
    return subcategory.type === 'bullets' ? vh(70) - 220 : vh(70);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar />
        <Intro
          backgroundColor={subcategory.color}
          view="essentialOil"
          height={30}
        />
        <ActionBar
          view={loading ? 'none' : 'default'}
          backColor={colors.white}
          backSize={30}
          navigation={navigation}
        />
        <View style={styles.content}>
          {/* title */}
          <View style={{...styles.textContainer, marginTop: 10}}>
            <Text style={styles.title}>{subcategory.title}</Text>
          </View>
          {/* description */}
          {subcategory.description && subcategory.description.length ? (
            <View style={{...styles.textDescContainer, marginTop: 10}}>
              <Text
                style={{
                  ...styles.description,
                  height: toggleDescription ? 'auto' : 50,
                }}>
                {subcategory.description}
              </Text>
              <Text
                style={{
                  color: colors.brandGreen,
                  fontWeight: 'bold',
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  paddingTop: 10,
                  paddingLeft: 20,
                }}
                onPress={() => setToggleDescription(!toggleDescription)}>
                {toggleDescription ? 'Ver menos' : 'Ver más'}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {/* Search input */}
          <SearchInput onChange={filterItems} />
        </View>
        {/* Item list */}
        {!itemList.length ? (
          <Text style={styles.noResult}>
            No encontramos resultados {'\u200A'}
            <MaterialCommunityIcons name="emoticon-sad-outline" size={13} />
          </Text>
        ) : (
          <View style={{height: listHeight()}}>
            <FlatList
              contentContainerStyle={{paddingBottom: 20}}
              style={styles.content}
              data={itemList}
              renderItem={i =>
                renderItem({
                  ...i,
                  navigation,
                  color: subcategory.color,
                  mainCategory: {
                    id: mainCategory.id,
                    title: mainCategory.title,
                  },
                  subcategory: {
                    id: subcategory.id,
                    title: subcategory.title,
                    type: subcategory.type,
                    showUsageType: subcategory.showUsageType,
                  },
                })
              }
              keyExtractor={i => i.id}
            />
          </View>
        )}
        {subcategory.type === 'bullets' ? (
          <View style={styles.actionContainer}>
            {client.associated && (
              <TouchableOpacity
                style={styles.actionButtons}
                onPress={() => toggleShowAssignConsultModal()}>
                <Feather
                  style={styles.actionButtonIcon}
                  color={colors.brandPurple}
                  name={'award'}
                  size={30}
                />
                <Text style={styles.likeButton}>Asignar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButtons}
              onPress={() => saveItem()}>
              <Feather
                style={styles.actionButtonIcon}
                name={loading ? 'clock' : 'heart'}
                size={30}
                color={itemExist() ? colors.danger : colors.lightGray}
              />
              {itemExist() ? (
                <Text style={styles.likeButton}>Me gusta!</Text>
              ) : (
                <></>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtons} onPress={share}>
              <Feather
                style={styles.actionButtonIcon}
                name="share"
                size={30}
                color={colors.brandGreen}
              />
            </TouchableOpacity>
            {/* assign modal */}
            {showAssignConsultModal && (
              <AssignConsultModal
                showAssignConsultModal={showAssignConsultModal}
                path={path}
                toggleShowAssignConsultModal={toggleShowAssignConsultModal}
              />
            )}
          </View>
        ) : (
          <></>
        )}
      </SafeAreaView>
    </View>
  );
};

const removeItems = obj => {
  delete obj.items;
  return obj;
};

const renderItem = ({
  item,
  id,
  color,
  navigation,
  mainCategory,
  subcategory,
}) => {
  const itemTypes = {
    list: (
      <Item
        key={id}
        item={item}
        color={color}
        navigation={navigation}
        mainCategory={mainCategory}
        subcategory={subcategory}
      />
    ),
    bullets: <Bullet description={item.description} />,
  };
  return itemTypes[subcategory.type];
};

const Bullet = ({description}) => {
  const title = /\*{1}([^*]+)\*{1}/g.exec(description);
  const newDescription = description.replace(/\*{1}([^*]+)\*{1}/g, '');
  return (
    <Text style={styles.bullets}>
      {title && title[1] ? <Text style={gs.bold}>{`${title[1]}:`}</Text> : ''}
      {newDescription}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 30,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  textDescContainer: {},
  title: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    fontSize: 20,
    color: colors.text,
    borderRadius: 10,
    overflow: 'hidden',
  },
  description: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.text,
    borderRadius: 10,
    overflow: 'hidden',
    height: 50,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  firstLetter: {
    borderRadius: 50,
    color: colors.white,
    width: 25,
    height: 25,
    paddingTop: 1,
    textAlign: 'center',
    marginRight: 5,
    overflow: 'hidden',
  },
  itemTitle: {
    color: colors.text,
  },
  noResult: {
    color: colors.text,
    textAlign: 'center',
    justifyContent: 'center',
  },
  bullets: {
    color: colors.text,
    fontSize: 15,
    marginTop: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    flexWrap: 'wrap',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  actionButtonIcon: {
    marginRight: 10,
  },
});

export default EssentialOil;
