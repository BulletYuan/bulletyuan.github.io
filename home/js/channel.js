if (!window.Bullet) window.Bullet = {};

window.Bullet['易经'] = {
  J(c1, c2, c3) {
    const total = c1 + c2 + c3;
    let result;
    switch (total) {
      // 三面朝上为阳
      // 三个少数，为老阳，是变动的阳爻，在卦中会变为阴。
      case 3:
        result = [1, 0];
        break;
      // 三面朝下为阴
      // 三个多数，为老阴，是变动的阴爻，在卦中会变为阳；
      case 0:
        result = [0, 1];
        break;
      // 两面朝上为阴
      // 两少一多，为少阴，是不变的阴爻；
      case 2:
        result = 0;
        break;
      // 两面朝下为阳
      // 两多一少，为少阳，是不变的阳爻；
      case 1:
        result = 1;
        break;
      default:
        break;
    }
    return result;
  },
  // 铜钱起卦
  A() {
    const randomFn = () => {
      const res = Math.random();
      if (res > 0.5) return 1;
      if (res < 0.5) return 0;
      return randomFn();
    };
    const [c1, c2, c3] = [randomFn(), randomFn(), randomFn()];
    const result = this.J(c1, c2, c3);
    if (result === undefined) return this.A();
    return result;
  },
  // 揲筮
  B(isLeft = 0, c = 5) {
    // c取值范围【1-9】
    const randomFn = (c) => {
      const base = () => Math.floor(Math.random() * 4 + 1); // 至少必抓random[1-5]
      const a = new Array(c).fill(0).reduce((l) => l + base(), 0);
      return a;
    };
    const Y = (total = 49) => {
      // 总数（起始总数四十九根）蓍草用两手随便一分，分别握于两手，象征两仪
      let [l, r] = [0, 0];
      if (isLeft) {
        l = randomFn(c);
        r = total - l;
      } else {
        r = randomFn(c);
        l = total - r;
      }
      // 右手抽出一根，象征三才
      r -= 1;
      // 将左手的蓍草四个四个地数，象征四季，记下余数
      let lYs = Math.floor(l % 4);
      lYs = lYs || 4;
      // 将右手的蓍草四个四个地数，象征四季，记下余数
      let rYs = Math.floor(r % 4);
      rYs = rYs || 4;
      // 这里两个余数相加不是四就一定是八，加上抽出来的象征三才的那根，得到的数不是五就是九，过揲之数
      const ys = lYs + rYs + 1;
      return ys;
    };
    let total = 49;
    const [c1, c2, c3] = new Array(3).fill(0).reduce((l) => {
      const res = Y(total);
      total -= res;
      // 将四五作为少数，八九作为多数
      const yao = res > 5 ? 0 : 1;
      l.push(yao);
      return l;
    }, []);
    const result = this.J(c1, c2, c3);
    return result;
  },
  卜卦(type = 1, isLeft = 0, counts = []) {
    const G = {
      111111: {
        name: '乾',
        label: '乾为天（乾卦）自强不息',
        desc: `困龙得水好运交，不由喜气上眉梢，一切谋望皆如意，向后时运渐渐高。
      这个卦是同卦（下乾上乾）相叠。象征天，喻龙（德才的君子），又象征纯粹的阳和健，表明兴盛强健。
      乾卦是根据万物变通的道理，以“元、亨、利、贞”为卦辞，示吉祥如意，教导人遵守天道的德行。`,
      },
      111011: {
        name: '履',
        label: '天泽履（履卦）脚踏实地',
        desc: `凤凰落在西岐山，长鸣几声出圣贤，天降文王开基业，富贵荣华八百年。
      这个卦是异卦（下兑上乾）相叠，乾为天；兑为泽，以天喻君，以泽喻民，原文：“履（踩）虎尾、不咥（咬）人。”因此，结果吉利。
      君上民下，各得其位。兑柔遇乾刚，所履危。履意为实践，卦义是脚踏实地的向前进取的意思。`,
      },
      111101: {
        name: '同人',
        label: '天火同人（同人卦）上下和同',
        desc: `心中有事犯猜疑，谋望从前不着实，幸遇明人来指引，诸般忧闷自消之。
      这个卦是异卦（下离上乾）相叠，乾为天，为君；离为火，为臣民百姓，上天下火，火性上升，同于天，上下和同，同舟共济，人际关系和谐，天下大同。`,
      },
      111001: {
        name: '无妄',
        label: '天雷无妄（无妄卦）无妄而得',
        desc: `飞鸟失机落笼中，纵然奋飞不能腾，目下只宜守本分，妄想扒高万不能。
      这个卦是异卦（下震上乾）相叠。乾为天为刚为健；震为雷为刚为动。
      动而健，刚阳盛，人心振奋，必有所得，但唯循纯正，不可妄行。无妄必有获，必可致福。`,
      },
      111110: {
        name: '姤',
        label: '天风姤（姤卦） 天下有风',
        desc: `他乡遇友喜气欢，须知运气福重添，自今交了顺当运，向后管保不相干。这个卦是异卦（下巽上乾）相叠。
      乾为天；巽为风。天下有风，吹遍大地，阴阳交合，万物茂盛。
      姤（gǒu）卦与夬卦相反，互为“综卦”。姤即遘，阴阳相遇。但五阳一阴，不能长久相处。`,
      },
      111010: {
        name: '讼',
        label: '天水讼（讼卦）慎争戒讼',
        desc: `心中有事事难做，恰是二人争路走，雨下俱是要占先，谁肯让谁走一步。
      这个卦是异卦（下坎上乾）相叠。同需卦相反，互为“综卦”。乾为刚健，坎为险陷。
      刚与险，健与险，彼此反对，定生争讼。争讼非善事，务必慎重戒惧。`,
      },
      111100: {
        name: '遁',
        label: '天山遁（遁卦）遁世救世',
        desc: `浓云蔽日不光明，劝君且莫出远行，婚姻求财皆不利，提防口舌到门庭。这个卦是异卦（下艮上乾）相叠。
      乾为天，艮为山。天下有山，山高天退。阴长阳消，小人得势，君子退隐，明哲保身，伺机救天下。`,
      },
      111000: {
        name: '否',
        label: '天地否（否卦）不交不通',
        desc: `虎落陷坑不堪言，进前容易退后难，谋望不遂自己便，疾病口舌事牵连。
      这个卦是异卦（下坤上乾）相叠，其结构同泰卦相反，系阳气上升，阴气下降，天地不交，万物不通。
      它们彼此为“综卦”，表明泰极而否，否极泰来，互为因果。`,
      },
      '011111': {
        name: '夬',
        label: '泽天夬 （夬卦） 决而能和',
        desc: `蜘蛛脱网赛天军，粘住游蜂翅翎毛，幸有大风吹破网，脱离灾难又逍遥。这个卦是异卦（下乾上兑）相叠。
      乾为天为健；兑为泽为悦。泽气上升，决注成雨，雨施大地，滋润万物。
      五阳去一阴，去之不难，决（去之意）即可，故名为夬（guài），夬即决。`,
      },
      '011011': {
        name: '泽',
        label: '兑为泽（泽卦）刚内柔外',
        desc: `这个卦象真可取，觉着做事不费力，休要错过这机关，事事觉得随心意。这个卦是同卦（下泽上泽）相叠。
      泽为水。两泽相连，两水交流，上下相和，团结一致，朋友相助，欢欣喜悦。兑为悦也。
      同秉刚健之德，外抱柔和之姿，坚行正道，导民向上。`,
      },
      '011101': {
        name: '革',
        label: '泽火革（革卦）顺天应人',
        desc: `苗逢旱天渐渐衰，幸得天恩降雨来，忧去喜来能变化，求谋干事遂心怀。这个卦是异卦（下离上兑）相叠。
      离为火；兑为泽，泽内有水。水在上而下浇，火在下而上升。火旺水干；水大火熄。
      二者相生亦相克，必然出现变革。变革是宇宙的基本规律。`,
      },
      '011001': {
        name: '随',
        label: '泽雷随（随卦）随时变通',
        desc: `泥里步踏这几年，推车靠崖在眼前，目下就该再使力，扒上崖去发财源。
      这个卦是异卦（下震上兑）相叠，震为雷、为动；兑为悦。动而悦就是“随”。
      随指相互顺从，己有随物，物能随己，彼此沟通。随必依时顺势，有原则和条件，以坚贞为前提。`,
      },
      '011110': {
        name: '大过',
        label: '泽风大过（大过卦）非常行动',
        desc: `夜晚梦里梦金银，醒来仍不见一文，目下只宜求本分，思想络是空劳神。这个卦是异卦（下巽上兑）相叠。
      兑为泽、为悦，巽为木、为顺，泽水淹舟，遂成大错。阴阳爻相反，阳大阴小，行动非常，有过度形象，内刚外柔。`,
      },
      '011010': {
        name: '困',
        label: '泽水困（困卦）困境求通',
        desc: `时运不来好伤怀，撮上押去把梯抬，一筒虫翼无到手，转了上去下不来。这个卦是异卦（下坎上兑）相叠。
      兑为阴为泽喻悦；坎为阳为水喻险。泽水困，陷入困境，才智难以施展，仍坚守正道，自得其乐，必可成事，摆脱困境。
    `,
      },
      '011100': {
        name: '咸',
        label: '泽山咸（咸卦）相互感应',
        desc: `运去黄金失色，时来棒槌发芽，月令极好无差，且喜心宽意大。这个卦是异卦（下艮上兑）相叠。
      艮为山；泽为水。兑柔在上，艮刚在下，水向下渗，柔上而刚下，交相感应。感则成。`,
      },
      '011000': {
        name: '萃',
        label: '泽地萃（萃卦）荟萃聚集',
        desc: `游鱼戏水被网惊，跳过龙门身化龙，三尺杨柳垂金线，万朵桃花显你能。这个卦是异卦相叠（下坤上兑）。
      坤为地、为顺；兑为泽、为水。泽泛滥淹没大地，人众多相互斗争，危机必四伏，务必顺天任贤，未雨绸缪，柔顺而又和悦，彼此相得益彰，安居乐业。
      萃，聚集、团结。`,
      },
      101111: {
        name: '大有',
        label: '火天大有（大有卦）顺天依时',
        desc: `砍树摸雀作事牢，是非口舌自然消，婚姻合伙不费力，若问走失未逃脱。
      这个卦是异卦（下乾上离）相叠。上卦为离，为火；下卦为乾，为天。
      火在天上，普照万物，万民归顺，顺天依时，大有所成。`,
      },
      101011: {
        name: '睽',
        label: '火泽睽（睽卦）异中求同',
        desc: `此卦占来运气歹，如同太公作买卖，贩猪牛快贩羊迟，猪羊齐贩断了宰。
      这个卦是异卦（下兑上离）相叠。离为火；兑为泽。上火下泽，相违不相济。克则生，往复无空。
      万物有所不同，必有所异，相互矛盾。睽即矛盾。`,
      },
      101101: {
        name: '离',
        label: '离为火（离卦）附和依托',
        desc: `官人来占主高升，庄农人家产业增，生意买卖利息厚，匠艺占之大亨通。
      这个卦是同卦（下离上离）相叠。离者丽也，附着之意，一阴附丽，上下二阳，该卦象征火，内空外明。
      离为火、为明、太阳反复升落，运行不息，柔顺为心。`,
      },
      101001: {
        name: '噬嗑',
        label: '火雷噬嗑（噬嗑卦）刚柔相济',
        desc: `运拙如同身受饥，幸得送饭又送食，适口充腹心欢喜，忧愁从此渐消移。
      这个卦是异卦（下震上离）相叠。离为阴卦；震为阳卦。阴阳相交，咬碎硬物，喻恩威并施，宽严结合，刚柔相济。
      噬嗑（shihe）为上下颚咬合，咀嚼。`,
      },
      101110: {
        name: '鼎',
        label: '火风鼎（鼎卦）稳重图变',
        desc: `莺鹜蛤蜊落沙滩，蛤蜊莺鹜两翅扇，渔人进前双得利，失走行人却自在。这个卦是异卦（下巽上离）相叠。
      燃木煮食，化生为熟，除旧布新的意思。鼎为重宝大器，三足稳重之象。煮食，喻食物充足，不再有困难和困扰。
      在此基础上宜变革，发展事业。`,
      },
      101010: {
        name: '未济',
        label: '火水未济（未济卦）事业未竟',
        desc: `离地着人几丈深，是防偷营劫寨人，后封太岁为凶煞，时加谨慎祸不侵。这个卦是异卦（下坎上离）相叠。
      离为火；坎为水。火上水下，火势压倒水势，救火大功未成，故称未济。
      《周易》以乾坤二卦为始，以既济、未济二卦为终，充分反映了变化发展的思想。
    `,
      },
      101100: {
        name: '旅',
        label: '火山旅（旅卦）依义顺时',
        desc: `飞鸟树上垒窝巢，小人使计举火烧，君占此卦为不吉，一切谋望枉徒劳。这个卦是异卦（下艮上离）相叠。
      此卦与丰卦相反，互为“综卦”。山中燃火，烧而不止，火势不停地向前蔓延，如同途中行人，急于赶路。因而称旅卦。`,
      },
      101000: {
        name: '晋',
        label: '火地晋（晋卦）求进发展',
        desc: `锄地锄去苗里草，谁想财帛将人找，一锄锄出银子来，这个运气也算好。这个卦是异卦（下坤上离）相叠。
      离为日，为光明；坤为地。太阳高悬，普照大地，大地卑顺，万物生长，光明磊落，柔进上行，喻事业蒸蒸日上。`,
      },
      '001111': {
        name: '大壮',
        label: '雷天大壮（大壮卦）壮勿妄动',
        desc: `卦占工师得大木，眼前该着走上路，时来运转多顺当，有事自管放心宽。这个卦是异卦（下乾上震）相叠。
      震为雷；乾为天。乾刚震动。天鸣雷，云雷滚，声势宏大，阳气盛壮，万物生长。刚壮有力故曰壮。
      大而且壮，故名大壮。四阳壮盛，积极而有所作为，上正下正，标正影直。`,
      },
      '001011': {
        name: '归妹',
        label: '雷泽归妹（归妹卦）立家兴业',
        desc: `求鱼须当向水中，树上求之不顺情，受尽爬揭难随意，劳而无功运平平。这个卦是异卦（下兑上震）相叠。
      震为动、为长男；兑为悦、为少女。以少女从长男，产生爱慕之情，有婚姻之动，有嫁女之象，故称归妹。男婚女嫁，天地大义，人的开始和终结。
      上卦与渐卦为综卦，交互为用。`,
      },
      '001101': {
        name: '丰',
        label: '雷火丰（丰卦）日中则斜',
        desc: `古镜昏暗好几年，一朝磨明似月圆，君子谋事逢此卦，时来运转喜自然。
      这个卦是异卦（下离上震）相叠，电闪雷鸣，成就巨大，喻达到顶峰，如日中天。
      告诫；务必注意事物向相反方面发展。治乱相因，盛衰无常，不可不警惕。`,
      },
      '001001': {
        name: '震',
        label: '震为雷（震卦）临危不乱',
        desc: `一口金钟在淤泥，人人拿着当玩石，忽然一日钟悬起，响亮一声天下知。这个卦是同卦（下震上震）相叠。
      震为雷，两震相叠，反响巨大，可消除沉闷之气，亨通畅达。
      平日应居安思危，怀恐惧心理，不敢有所怠慢，遇到突发事变，也能安然自若，谈笑如常。`,
      },
      '001110': {
        name: '恒',
        label: '雷风恒（恒卦）恒心有成',
        desc: `渔翁寻鱼运气好，鱼来撞网跑不了，别人使本挣不来，谁想一到就凑合。
      这个卦是异卦（下巽上震）相叠。震为男、为雷；巽为女、为风。震刚在上，巽柔在下。
      刚上柔下，造化有常，相互助长。阴阳相应，常情，故称为恒。`,
      },
      '001010': {
        name: '解',
        label: '雷水解（解卦）柔道致治',
        desc: `目下月令如过关，千辛万苦受熬煎，时来恰相有人救，任意所为不相干。这个卦是异卦（下坎上震）相叠。
      震为雷、为动；坎为水、为险。险在内，动在外。
      严冬天地闭塞，静极而动。万象更新，冬去春来，一切消除，是为解。`,
      },
      '001100': {
        name: '小过',
        label: '雷山小过（小过卦）行动有度',
        desc: `行人路过独木桥，心内惶恐眼里瞧，爽利保你过得去，慢行一定不安牢。这个卦是异卦（下艮上震）相叠。
      艮为山；震为雷。过山雷鸣，不可不畏惧。阳为大，阴为小，卦外四阴超过中二阳，故称“小过”，小有越过。
    `,
      },
      '001000': {
        name: '豫',
        label: '雷地豫（豫卦）顺时依势',
        desc: `太公插下杏黄旗，收妖为徒归西岐，自此青龙得了位，一旦谋望百事宜。
      这个卦是异卦（下坤上震）相叠，坤为地，为顺；震为雷，为动。雷依时出，预示大地回春。因顺而动，和乐之源。
      此卦与谦卦互为综卦，交互作用。`,
      },
      110111: {
        name: '小畜',
        label: '风天小畜（小畜卦）蓄养待进',
        desc: `苗逢旱天尽焦梢，水想云浓雨不浇，农人仰面长吁气，是从款来莫心高。
      这个卦是异卦（下乾上巽）相叠，乾为天；巽为风。喻风调雨顺，谷物滋长，故卦名小畜（蓄）。
      力量有限，须待发展到一定程度，才可大有作为。`,
      },
      110011: {
        name: '中孚',
        label: '风泽中孚（中孚卦）诚信立身',
        desc: `路上行人色匆匆，急忙无桥过薄冰，小心谨慎过得去，一步错了落水中。这个卦是异卦（下兑上巽）相叠。
      孚（fú）本义孵，孵卵出壳的日期非常准确，有信的意义。
      卦形外实内虚，喻心中诚信，所以称中孚卦。这是立身处世的根本。`,
      },
      110101: {
        name: '家人',
        label: '风火家人（家人卦）诚威治业',
        desc: `一朵鲜花镜中开，看着极好取不来，劝君休把镜花恋，卦若逢之主可怪。这个卦是异卦（下离上巽）相叠。
      离为火；巽为风。火使热气上升，成为风。一切事物皆应以内在为本，然后伸延到外。
      发生于内，形成于外。喻先治家而后治天下，家道正，天下安乐。`,
      },
      110001: {
        name: '益',
        label: '风雷益（益卦）损上益下',
        desc: `时来运转吉气发，多年枯木又开花，枝叶重生多茂盛，几人见了几人夸。这个卦是异卦（下震上巽）相叠。
      巽为风；震为雷。风雷激荡，其势愈强，雷愈响，风雷相助互长，交相助益。此卦与损卦相反。
      它是损上以益下，后者是损下以益上。二卦阐述的是损益的原则。`,
      },
      110110: {
        name: '巽',
        label: '巽为风（巽卦）谦逊受益',
        desc: `一叶孤舟落沙滩，有篙无水进退难，时逢大雨江湖溢，不用费力任往返。
      这个卦是同卦（下巽上巽）相叠，巽（xùn）为风，两风相重，长风不绝，无孔不入，巽义为顺。
      谦逊的态度和行为可无往不利。`,
      },
      110010: {
        name: '涣',
        label: '风水涣（涣卦）拯救涣散',
        desc: `隔河望见一锭金，欲取岸宽水又深，指望资财难到手，昼思夜想枉费心。这个卦是异卦（下坎上巽）相叠。
      风在水上行，推波助澜，四方流溢。涣，水流流散之意。
      象征组织和人心涣散，必用积极的手段和方法克服，战胜弊端，挽救涣散，转危为安。`,
      },
      110100: {
        name: '渐',
        label: '风山渐（渐卦）渐进蓄德',
        desc: `俊鸟幸得出笼中，脱离灾难显威风，一朝得意福力至，东西南北任意行。这个卦是异卦（下艮上巽）相叠。
      艮为山；巽为木。山上有木，逐渐成长，山也随着增高。这是逐渐进步的过程，所以称渐，渐即进，渐渐前进而不急速。`,
      },
      110000: {
        name: '观',
        label: '风地观（观卦）观下瞻上',
        desc: `卦遇蓬花旱逢河，生意买卖利息多，婚姻自有人来助，出门永不受折磨。
      这个卦是异卦（下坤上巽）相叠，风行地上，喻德教遍施。观卦与临卦互为综卦，交相使用。
      在上者以道义观天下；在下者以敬仰瞻上，人心顺服归从。`,
      },
      '010111': {
        name: '需',
        label: '水天需（需卦）守正待机',
        desc: `明珠土埋日久深，无光无亮到如今，忽然大风吹土去，自然显露有重新。
      这个卦是异卦（下乾上坎）相叠，下卦是乾，刚健之意；上卦是坎，险陷之意。
      以刚逢险，宜稳健之妥，不可冒失行动，观时待变，所往一定成功。`,
      },
      '010011': {
        name: '节',
        label: '水泽节（节卦）万物有节',
        desc: `时来运转喜气生，登台封神姜太公，到此诸神皆退位，纵然有祸不成凶。这个卦是异卦（下兑上坎）相叠。
      兑为泽；坎为水。泽有水而流有限，多必溢于泽外。因此要有节度，故称节。节卦与涣卦相反，互为综卦，交相使用。
      天地有节度才能常新，国家有节度才能安稳，个人有节度才能完美。`,
      },
      '010101': {
        name: '既济',
        label: '水火既济（既济卦）盛极将衰',
        desc: `金榜以上题姓名，不负当年苦用功，人逢此卦名吉庆，一切谋望大亨通。这个卦是异卦（下离上坎）相叠。
      坎为水；离为火。水火相交，水在火上，水势压倒火势，救火大功告成。既，已经；济，成也。
      既济就是事情已经成功，但终将发生变故。`,
      },
      '010001': {
        name: '屯',
        label: '水雷屯（屯卦）起始维艰',
        desc: `风刮乱丝不见头，颠三倒四犯忧愁，慢从款来左顺遂，急促反惹不自由。
      这个卦是异卦（下震上坎）相叠，震为雷，喻动；坎为雨，喻险。
      雷雨交加，险象丛生，环境恶劣。“屯”原指植物萌生大地。万物始生，充满艰难险阻，然而顺时应运，必欣欣向荣。`,
      },
      '010110': {
        name: '井',
        label: '水风井（井卦）求贤若渴',
        desc: `枯井破费已多年，一朝流泉出来鲜，资生济渴人称羡，时来运转喜自然。这个卦是异卦（下巽上坎）相叠。
      坎为水；巽为木。树木得水而蓬勃生长。人靠水井生活，水井由人挖掘而成。
      相互为养，井以水养人，经久不竭，人应取此德而勤劳自勉。`,
      },
      '010010': {
        name: '坎',
        label: '坎为水（坎卦）行险用险',
        desc: `一轮明月照水中，只见影儿不见踪，愚夫当财下去取，摸来摸去一场空。
      这个卦是同卦（下坎上坎）相叠。坎为水、为险，两坎相重，险上加险，险阻重重。一阳陷二阴。所幸阴虚阳实，诚信可豁然贯通。
      虽险难重重，却方能显人性光彩。`,
      },
      '010100': {
        name: '蹇',
        label: '水山蹇（蹇卦）险阻在前',
        desc: `大雨倾地雪满天，路上行人苦又寒，拖泥带水费尽力，事不遂心且耐烦。这个卦是异卦（下艮上坎）相叠。
      坎为水；艮为山。山高水深，困难重重，人生险阻，见险而止，明哲保身，可谓智慧。蹇，跋行艰难。`,
      },
      '010000': {
        name: '比',
        label: '水地比（比卦）诚信团结',
        desc: `顺风行船撒起帆，上天又助一蓬风，不用费力逍遥去，任意而行大亨通。
      这个卦是异卦（下坤上坎）相叠，坤为地；坎为水。水附大地，地纳河海，相互依赖，亲密无间。
      此卦与师卦完全相反，互为综卦。它阐述的是相亲相辅，宽宏无私，精诚团结的道理。`,
      },
      100111: {
        name: '大畜',
        label: '山天大畜（大畜卦）止而不止',
        desc: `忧愁常锁两眉头，千头万绪挂心间，从今以后防开阵，任意行而不相干。这个卦是异卦（下乾上艮）相叠。
      乾为天，刚健；艮为山，笃实。畜者积聚，大畜意为大积蓄。
      为此不畏严重的艰难险阻，努力修身养性以丰富德业。`,
      },
      100011: {
        name: '损',
        label: '山泽损（损卦）损益制衡',
        desc: `时运不至费心多，比作推车受折磨，山路崎岖吊下耳，左插右按按不着。这个卦是异卦（下兑上艮）相叠。
      艮为山；兑为泽。上山下泽，大泽浸蚀山根。损益相间，损中有益，益中有损。二者之间，不可不慎重对待。
      损下益上，治理国家，过度会损伤国基。应损则损，但必量力、适度。少损而益最佳。`,
      },
      100101: {
        name: '贲',
        label: '山火贲（贲卦）饰外扬质',
        desc: `近来运转瑞气周，窈窕淑女君子求。钟鼓乐之大吉庆，占者逢之喜临头。
      这个卦是异卦（下离上艮）相叠。离为火为明；艮为山为止。文明而有节制。
      贲（bi）卦论述文与质的关系，以质为主，以文调节。贲，文饰、修饰。`,
      },
      100001: {
        name: '颐',
        label: '山雷颐（颐卦）纯正以养',
        desc: `太公独钓渭水河，手执丝杆忧愁多，时来又遇文王访，自此永不受折磨。
      这个卦是异卦（下震上艮）相叠。震为雷，艮为山。山在上而雷在下，外实内虚。
      春暖万物养育，依时养贤育民。阳实阴虚，实者养人，虚者为人养。自食其力。`,
      },
      100110: {
        name: '蛊',
        label: '山风蛊（蛊卦）振疲起衰',
        desc: `卦中爻象如推磨，顺当为福反为祸，心中有益且迟迟，凡事尽从忙处错。
      这个卦是异卦（下巽上艮）相叠，与随卦互为综卦。蛊（gu）本意为事，引申为多事、混乱。
      器皿久不用而生虫称“蛊”，喻天下久安而因循、腐败，必须革新创造，治理整顿，挽救危机，重振事业。`,
      },
      100010: {
        name: '蒙',
        label: '山水蒙（蒙卦）启蒙奋发',
        desc: `卦中爻象犯小耗，君子占之运不高，婚姻合伙有琐碎，做事必然受苦劳。
      这个卦是异卦（下坎上艮）相叠，艮是山的形象，喻止；坎是水的形象，喻险。
      卦形为山下有险，仍不停止前进，是为蒙昧，故称蒙卦。
      但因把握时机，行动切合时宜，因此，具有启蒙和通达的卦象。`,
      },
      100100: {
        name: '艮',
        label: '艮为山（艮卦）动静适时',
        desc: `财帛常打心头走，可惜眼前难到手，不如意时且忍耐，逢着闲事休开口。这个卦是同卦（下艮上艮）相叠。
      艮为山，二山相重，喻静止。它和震卦相反。高潮过后，必然出现低潮，进入事物的相对静止阶段。
      静止如山，宜止则止，宜行则行。行止即动和静，都不可失机，应恰到好处，动静得宜，适可而止。`,
      },
      100000: {
        name: '剥',
        label: '山地剥（剥卦）顺势而止',
        desc: `鹊遇天晚宿林中，不知林内先有鹰，虽然同处心生恶，卦若逢之是非轻。
      这个卦是异卦（下坤上艮）相叠。五阴在下，一阳在上，阴盛而阳孤；高山附于地。二者都是剥落象，故为“剥卦”。
      此卦阴盛阳衰，喻小人得势，君子困顿，事业败坏。`,
      },
      '000111': {
        name: '泰',
        label: '地天泰（泰卦）应时而变',
        desc: `学文满腹入场闱，三元及第得意回，从今解去愁和闷，喜庆平地一声雷。
      这个卦是异卦（下乾上坤）相叠，乾为天，为阳；坤为地，为阴，阴阳交感，上下互通，天地相交，万物纷纭。反之则凶。
      万事万物，皆对立，转化，盛极必衰，衰而转盛，故应时而变者泰（通）。`,
      },
      '000011': {
        name: '临',
        label: '地泽临（临卦）教民保民',
        desc: `君王无道民倒悬，常想拨云见青天，幸逢明主施仁政，重又安居乐自然。
      这个卦是异卦（下兑上坤）相叠。坤为地；兑为泽，地高于泽，泽容于地。
      喻君主亲临天下，治国安邦，上下融洽。`,
      },
      '000101': {
        name: '明夷',
        label: '地火明夷（明夷卦）晦而转明',
        desc: `时乖运拙走不着，急忙过河拆了桥，恩人无义反为怨，凡事无功枉受劳。这个卦是异卦（下离上坤）相叠。
      离为明，坤为顺；离为日；坤为地。日没入地，光明受损，前途不明，环境困难，宜遵时养晦，坚守正道，外愚内慧，韬光养晦。`,
      },
      '000001': {
        name: '复',
        label: '地雷复（复卦）寓动于顺',
        desc: `马氏太公不相合，世人占之忧疑多，恩人无义反为怨，是非平地起风波。
      这个卦是异卦（下震上坤）相叠。震为雷、为动；坤为地、为顺，动则顺，顺其自然。
      动在顺中，内阳外阴，循序运动，进退自如，利于前进。`,
      },
      '000110': {
        name: '升',
        label: '地风升（升卦）柔顺谦虚',
        desc: `士人来占必得名，生意买卖也兴隆，匠艺逢之交易好，农间庄稼亦收成。这个卦是异卦相叠（下巽上坤）。
      坤为地、为顺；巽为木、为逊。大地生长树木，逐步的成长，日渐高大成材，喻事业步步高升，前程远大，故名“升”。`,
      },
      '000010': {
        name: '师',
        label: '地水师（师卦）行险而顺',
        desc: `将帅领旨去出征，骑着烈马拉硬弓，百步穿杨去得准，箭中金钱喜气生。
      这个卦是异卦（下坎上坤）相叠。“师”指军队。
      坎为水、为险；坤为地、为顺，喻寓兵于农。
      兵凶战危，用兵乃圣人不得已而为之，但它可以顺利无阻碍地解决矛盾，因为顺乎形势，师出有名，故能化凶为吉。`,
      },
      '000100': {
        name: '谦',
        label: '地山谦（谦卦）内高外低',
        desc: `天赐贫人一封金，不争不抢两平分，彼此分得金到手，一切谋望皆遂心。
      这个卦是异卦（下艮上坤）相叠，艮为山，坤为地。
      地面有山，地卑（低）而山高，是为内高外低，比喻功高不自居，名高不自誉，位高不自傲。这就是谦。`,
      },
      '000000': {
        name: '坤',
        label: '坤为地（坤卦）厚德载物',
        desc: `肥羊失群入山岗，饿虎逢之把口张，适口充肠心欢喜，卦若占之大吉昌。
      这个卦是同卦（下坤上坤）相叠，阴性。象征地（与乾卦相反），顺从天。
      承载万物，伸展无穷无尽。坤卦以雌马为象征，表明地道生育抚养万物，而又依天顺时，性情温顺。
      它以“先迷后得”证明“坤”顺从“乾”，依随“乾”，才能把握正确方向，遵循正道，获取吉利。`,
      },
    };
    const g = new Array(6).fill(0).reduce(
      (l, c, i) => {
        const arg = counts[i];
        // eslint-disable-next-line no-multi-assign
        const yao = type === 1 ? this.A() : this.B(isLeft, arg);
        // 变之前的卦称为“本卦”，变之后称为“之卦”
        const [ben, zhi] = l;
        const result = [ben, zhi];
        if (Array.isArray(yao)) {
          const [b, z] = yao;
          result[0] = ben + b;
          result[1] = zhi + z;
        } else {
          let _yao = Number(yao);
          _yao = Number.isNaN(_yao) ? 0 : _yao;
          result[0] = ben + _yao;
          result[1] = zhi + _yao;
        }
        console.log(`第${i + 1}次占卜`, result);
        return result;
      },
      ['', '']
    );
    // 变之前的卦称为“本卦”，变之后称为“之卦”
    const [ben, zhi] = g;
    const [Ben, Zhi] = [G[ben], G[zhi]];
    if (!Ben || !Zhi) return;
    const benArr = ben.split('');
    let hu = new Array(6).fill(0);
    benArr.forEach((c, i) => {
      if ([2, 3, 4].includes(i)) {
        // 本卦中的第三、四、五爻，拿出来作为互卦的上卦
        hu[i - 2] = c;
      }
      if ([1, 2, 3].includes(i)) {
        // 本卦的第二、三、四爻
        hu[i + 2] = c;
      }
    });
    hu = hu.join('');
    const Hu = G[hu];
    console.log('🚀 ~ file: Untitled-1 ~ line 573 ~ hu', hu);
    const cuo = benArr.map((v) => `${Number(!Number(v))}`).join('');
    const Cuo = G[cuo];
    console.log('🚀 ~ file: Untitled-1 ~ line 576 ~ cuo', cuo);
    const zong = [...(benArr.slice(-3) || []), ...(benArr.slice(0, 3) || [])].join('');
    const Zong = G[zong];
    console.log('🚀 ~ file: Untitled-1 ~ line 576 ~ zong', zong);
    console.log(
      '\n本卦：代表事物的原本\n',
      `${Ben?.name}-${Ben?.label}\n${Ben?.desc}`,
      '\n',
      '\n互卦：代表事物的变化过程\n',
      `${Hu?.name}-${Hu?.label}\n${Hu?.desc}`,
      '\n',
      '\n错卦：代表事物的对立面\n',
      `${Cuo?.name}-${Cuo?.label}\n${Cuo?.desc}`,
      '\n',
      '\n综卦：代表事物的另一角度\n',
      `${Zong?.name}-${Zong?.label}\n${Zong?.desc}`,
      '\n',
      '\n之卦：代表事物变化的结果\n',
      `${Zhi?.name}-${Zhi?.label}\n${Zhi?.desc}`
    );
  },
};
