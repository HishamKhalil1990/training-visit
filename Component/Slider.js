import React, { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    Alert,
    Dimensions,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as Print from 'expo-print';
import Item from "./Item";
import * as apis from '../apis/apis'
import Loader from "./Loader";
import * as functions from '../utils/functions'

const width = Dimensions.get("window").width;

let allCatData = []
let sendAction = false

export default Slider = ({data,changeData,username,branchValue,time,date,names}) => {
    const [catData,setCatData] = useState(data)
    const [cat,setCat] = useState(data[0])
    const [maxSlidesNo,setMaxSlidesNo] = useState(data[0].max)
    const [currIndex,setCurrIndex] = useState(0)
    const [sent,setSent] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        data.forEach(cat => {
            allCatData.push(cat)
        })
        return () => {
            changeData(allCatData,sendAction)
            allCatData = []
            sendAction = false
        }
    },[])
    
    const scrollSlider = (type) => {
        let newIndex = currIndex
        if(type == 'next'){
            if(currIndex < (maxSlidesNo - 1)){
                newIndex += 1
            }
        }else if(type == 'back'){
            if(currIndex > 0){
                newIndex -= 1
            }
        }
        setCurrIndex(newIndex)
        setCat(catData[newIndex])
    }

    const reSubmit = async(msg) => {
        Alert.alert(
          'اعادة ارسال',
          `${msg} هل تريد اعادة الارسال ؟`,
          [
            {
              text: 'Cancel',
              onPress: () => {
                return null;
              },
            },
            {
              text: 'Confirm',
              onPress: () => {
                return sendData()
              },
            },
          ],
          {cancelable: false},
        );
    }

    async function sendData(){
        const data = {
            username,
            branchValue,
            names,
            time,
            date,
            allCatData
        }
        setLoading(true)
        const response = await apis.saveRate(data)
        if(response.status == "success"){
            setLoading(false)
            setSent(true)
            sendAction = true
            alert('تم الارسال')
        }else{
            setLoading(false)
            reSubmit(response.msg)
        }
    }

    const makePDF = async() => {
        const data = {
            username,
            branchValue,
            names,
            time,
            date,
            allCatData
        }
        const html = functions.createHTML(data)
        const print = async () => {
            await Print.printAsync({
              html,
            });
        };

        await print()
    }

    const submit = async() => {
        Alert.alert(
          'ارسال',
          'هل تريد الارسال ؟',
          [
            {
              text: 'Cancel',
              onPress: () => {
                return null;
              },
            },
            {
              text: 'Confirm',
              onPress: () => {
                return sendData()
              },
            },
          ],
          {cancelable: false},
        );
    }
    
    const Category = () => {
        const [editCat,setEditCat] = useState(cat)
        const [total,setTotal] = useState(cat.total)

        useEffect(() => {
            return () => setCatData(allCatData)
        },[])

        const changeCatData = (newCat) => {
            setTotal(newCat.total)
            setEditCat({...newCat})
            allCatData[editCat.id] = newCat
        }
        
        return(
            <View style={styles.Catcontainer}>
                <View style={styles.nameCatContainer}>
                    <Text style={styles.nameText}>
                        {cat.name}
                    </Text>
                </View>
                <View style={styles.header}>
                    <Text style={{height:'100%',width:'70%',textAlign:'center',textAlignVertical:'center',color:'#fff'}}>السؤال</Text>
                    <Text style={{height:'100%',width:'30%',textAlign:'center',textAlignVertical:'center',color:'#fff'}}>العلامة</Text>
                </View>
                <View style={styles.sliderCatContainer}>
                    <FlatList
                        data={cat.questions}
                        renderItem={({item}) => <Item item={item} cat={cat} changeCatData={changeCatData} catTotal={total}/>}
                        keyExtractor={item => item.id}
                        scrollEnabled={true}
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={{textAlign:'center',textAlignVertical:'center'}}>
                        {`المجموع ${total} / ${cat.maxTotal}`}
                    </Text>
                </View>
            </View>
        )
    }


    return(
        <View style={styles.container}>
            <Loader loading={loading} />
            <View style={styles.sliderContainer}>
                <Category/>
            </View>
            <View style={styles.sliderButtonsContainer}>
                <View style={{marginLeft:40}}>
                    {currIndex != (maxSlidesNo - 1)?
                        <TouchableOpacity
                            onPress={() => scrollSlider('next')}
                            style={{flex:1,flexDirection:'row',justifyContent:"center",alignItems:'center'}}
                        >
                            <MaterialIcons name="arrow-forward-ios" size={24} color="#fff" />
                            <Text style={{color:'#fff',fontSize:15}}>
                            {` التالي`}
                            </Text>
                        </TouchableOpacity>
                    :
                        <>
                            {!sent?
                                <TouchableOpacity
                                    onPress={() => submit()}
                                    style={{flex:1,flexDirection:'row',justifyContent:"center",alignItems:'center'}}
                                >
                                    <Text style={{
                                        color:"#082032",
                                        fontSize:15,
                                        paddingTop:2,
                                        paddingBottom:2,
                                        paddingLeft:15,
                                        paddingRight:15,
                                        backgroundColor:'#fff',
                                        borderRadius:15
                                    }}>
                                    {`Done`}
                                    </Text>
                                </TouchableOpacity>
                            :
                                <TouchableOpacity
                                    onPress={() => makePDF()}
                                    style={{flex:1,flexDirection:'row',justifyContent:"center",alignItems:'center'}}
                                >
                                    <AntDesign name="pdffile1" size={30} color="#fff" />
                                </TouchableOpacity>
                            }
                        </>
                    }
                </View>
                <View>
                    <Text style={{color:'#fff',fontSize:20}}>
                        {`${maxSlidesNo} : ${currIndex + 1}`} 
                    </Text>
                </View>
                <View style={{marginRight:40}}>
                    <TouchableOpacity
                        onPress={() => scrollSlider('back')}
                        style={{flex:1,flexDirection:'row',justifyContent:"center",alignItems:'center'}}
                    >
                        <Text style={{color:'#fff',fontSize:15}}>
                            {`السابق `}
                        </Text>
                        <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    sliderContainer:{
        width:'100%',
        height:'90%',
    },
    sliderButtonsContainer:{
        flex:1,
        width:'100%',
        height:'10%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    Catcontainer:{
        flex:1,
        width:width,
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    sliderCatContainer:{
        width:'100%',
        height:'80%',
    },
    nameCatContainer:{
        width:'100%',
        height:'10%',
    },
    nameText:{
        width:'100%',
        height:'100%',
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:25,
        fontWeight:'bold',
        color:"#082032",
        borderBottomColor:"#082032",
        borderBottomWidth:3
    },
    header:{
        flex:1,
        width:width,
        height:'5%',
        flexDirection:'row',
        borderBottomWidth:3,
        backgroundColor:"#082032",
        borderBottomColor:"#082032",
    },
    footer:{
        flex:1,
        width:width,
        height:'5%',
        justifyContent:'center',
        alignItems:'center',
        borderTopWidth:3,
        borderTopColor:"#082032"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,

    },
    modalView: {
        minHeight:300,
        minWidth:width*0.9,
        maxHeight:300,
        maxWidth:width*0.9,
        // margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
        text:{
        marginTop:-20,
        height:'95%',
        width:width*0.85,
        padding: 10,
        color:"#082032",
        borderBottomColor:"#082032",
        textAlignVertical:'top',
        borderWidth:3,
        borderRadius:10
    },
    noteBtuView:{
        flex:1,
        width:'100%',
        flexDirection:'row-reverse',
        marginTop:10,
        justifyContent:'flex-start',
    }
})