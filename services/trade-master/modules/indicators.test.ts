import { bbIsNotOverbought, calcSD } from './indicators'

describe('Trade Master Indicators', () => {
  test.skip('bbIsNotOverbought should work correctly', () => {
    const candles = [ [0] ]
    expect(bbIsNotOverbought(candles)).toEqual(false)
  })

  test('calcSD should work correctly', () => {
    const candles = [[1522616400000,"0.00009235","0.00009235","0.00009158","0.00009234","1597.00000000",1522619999999,"0.14715254",12,"1012.00000000","0.09345243","0"],[1522620000000,"0.00009180","0.00009275","0.00009158","0.00009275","5234.00000000",1522623599999,"0.48182227",31,"2564.00000000","0.23675044","0"],[1522623600000,"0.00009274","0.00009274","0.00009166","0.00009166","1681.00000000",1522627199999,"0.15473968",16,"588.00000000","0.05438992","0"],[1522627200000,"0.00009166","0.00009240","0.00009142","0.00009142","3647.00000000",1522630799999,"0.33367400",41,"337.00000000","0.03097008","0"],[1522630800000,"0.00009142","0.00009254","0.00009142","0.00009143","3313.00000000",1522634399999,"0.30364814",31,"924.00000000","0.08508612","0"],[1522634400000,"0.00009149","0.00009203","0.00009143","0.00009150","4222.00000000",1522637999999,"0.38627855",22,"55.00000000","0.00505690","0"],[1522638000000,"0.00009166","0.00009166","0.00009126","0.00009128","3814.00000000",1522641599999,"0.34859331",22,"655.00000000","0.05981322","0"],[1522641600000,"0.00009128","0.00009128","0.00009121","0.00009123","1794.00000000",1522645199999,"0.16365217",16,"52.00000000","0.00474396","0"],[1522645200000,"0.00009123","0.00009165","0.00009100","0.00009160","3578.00000000",1522648799999,"0.32601861",20,"935.00000000","0.08538885","0"],[1522648800000,"0.00009160","0.00009180","0.00009084","0.00009111","12965.00000000",1522652399999,"1.18052675",46,"2551.00000000","0.23288276","0"],[1522652400000,"0.00009111","0.00009387","0.00009111","0.00009113","30868.00000000",1522655999999,"2.85878656",193,"23494.00000000","2.17737293","0"],[1522656000000,"0.00009181","0.00009216","0.00009059","0.00009216","4574.00000000",1522659599999,"0.41755586",58,"1693.00000000","0.15537422","0"],[1522659600000,"0.00009216","0.00009305","0.00009122","0.00009239","1638.00000000",1522663199999,"0.15096514",17,"341.00000000","0.03147304","0"],[1522663200000,"0.00009238","0.00013789","0.00009181","0.00012837","1227180.00000000",1522666799999,"149.02165542",7698,"641957.00000000","76.67673534","0"],[1522666800000,"0.00012838","0.00013200","0.00011296","0.00011871","962697.00000000",1522670399999,"118.29273041",5708,"405121.00000000","49.89516697","0"],[1522670400000,"0.00011875","0.00012688","0.00011387","0.00012246","343670.00000000",1522673999999,"41.17459485",2493,"160027.00000000","19.14687492","0"],[1522674000000,"0.00012200","0.00012393","0.00011514","0.00011569","300493.00000000",1522677599999,"35.86948514",1914,"118795.00000000","14.21913919","0"],[1522677600000,"0.00011568","0.00011622","0.00011260","0.00011389","206573.00000000",1522681199999,"23.51025521",1094,"74332.00000000","8.49087941","0"],[1522681200000,"0.00011390","0.00011470","0.00010876","0.00010966","150357.00000000",1522684799999,"16.71013556",1106,"54718.00000000","6.06240065","0"],[1522684800000,"0.00011013","0.00011353","0.00010971","0.00011068","189125.00000000",1522688399999,"21.13617880",1035,"111984.00000000","12.52209609","0"]]
    expect(calcSD(candles)).toEqual(false)
  })
})
