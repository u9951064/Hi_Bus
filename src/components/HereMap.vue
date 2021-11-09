<template>
  <div class="here-map">
    <div
      class="map-container"
      ref="hereMap"
      :data-s="stops"
      :data-b="busPositions"
    ></div>
    <div
      class="map-stop-info-container"
      style="display: none"
      ref="stopInfoBox"
    >
      <div class="map-info-box" v-if="!!activeStop">
        <a class="map-close-btn">
          <img src="../assets/icons/close-icon.svg" />
        </a>
        <div class="map-stop-name">{{ activeStop.stopName }}</div>
        <div class="map-route-info">
          <div class="map-route-name" v-html="busRouteName"></div>
          <div class="map-head-sign" v-html="busHeadSign"></div>
        </div>
        <div class="map-arrival-tag">
          <ArrivalTimeTag :arrivalInfo="currentArrivalInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { markRaw } from "@vue/reactivity";
import { apiKey } from "@/configs/HereMapConfig";
import ArrivalTimeTag from "@/components/ArrivalTimeTag.vue";

export default {
  name: "HereMap",
  components: {
    ArrivalTimeTag,
  },
  props: {
    busRouteName: {
      type: String,
      required: true,
    },
    busHeadSign: {
      type: String,
      required: true,
    },
    busStops: {
      type: Array,
      required: true,
    },
    arrivalInfos: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      initialized: false,
      activeStop: null,
      mapObject: markRaw({
        platform: null,
        map: null,
        layer: null,
        routePathGroup: null,
        stopGroup: null,
        busGroup: null,
        infoGroup: null,
      }),
      currentData: markRaw({
        busStops: null,
        arrivalInfos: null,
      }),
    };
  },
  created() {
    this.mapObject.platform = new window.H.service.Platform({ apiKey });
    this.mapObject.layer = this.mapObject.platform.createDefaultLayers({
      lg: "CHT",
    });
  },
  mounted() {
    this.initializeHereMap();
  },
  methods: {
    initializeHereMap() {
      // rendering map
      const H = window.H;
      const map = new H.Map(
        this.$refs.hereMap,
        this.mapObject.layer.vector.normal.map,
        {
          layers: [
            this.mapObject.layer.vector.normal.map,
            this.mapObject.layer.raster.normal.map,
          ],
          zoom: 15,
          center: { lat: 25.0681944993822, lng: 121.397454504827 },
          pixelRatio: window.devicePixelRatio || 1,
        }
      );

      addEventListener("resize", () => map.getViewPort().resize());

      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      new H.ui.UI(map, {
        mapsettings: false,
        distancemeasurement: false,
        scalebar: {
          alignment: H.ui.LayoutAlignment.LEFT_BOTTOM,
        },
        zoom: {
          slider: false,
          sliderSnaps: false,
        },
      });

      this.mapObject.map = map;

      this.mapObject.stopGroup = new H.map.Group();
      this.mapObject.busGroup = new H.map.Group();
      this.mapObject.infoGroup = new H.map.Group();
      this.mapObject.map.addObject(this.mapObject.stopGroup);
      this.mapObject.map.addObject(this.mapObject.busGroup);
      this.mapObject.map.addObject(this.mapObject.infoGroup);

      this.mapObject.busGroup.addEventListener("tap", (evt) => {
        this.openInfoBox(evt.target.getData());
      });
      this.mapObject.stopGroup.addEventListener("tap", (evt) => {
        this.openInfoBox(evt.target.getData());
      });

      this.$nextTick(() => {
        this.initialized = true;
      });
    },
    // drawBusRoutePath() {
    //   const H = window.H;
    //   const pathPoints = new H.geo.LineString([]);
    //   const GeoJSON =
    //     "[[121.397454504827,25.0681944993822],[121.397828494667,25.068161017132],[121.398235736218,25.0681634550441],[121.398500138849,25.0691640420286],[121.398599289835,25.06965569685],[121.398756605376,25.0706216554695],[121.398800134141,25.0711703727757],[121.398791231729,25.0719999868473],[121.398681175497,25.0732986176075],[121.398540611217,25.0737966946254],[121.398382955197,25.074300375482],[121.398146754564,25.0747983801002],[121.397773031615,25.0751990547373],[121.397370707419,25.0755128004848],[121.396951752847,25.0756788793512],[121.396249538572,25.0758081237291],[121.396511206349,25.0767372293846],[121.396633430853,25.0772582483883],[121.396806309497,25.0779058769181],[121.396887664152,25.0781845000494],[121.396699531511,25.078234007399],[121.39595955232,25.0783640960522],[121.39418961327,25.0786001308975],[121.3926728289,25.0786558998719],[121.391878632586,25.0786853292905],[121.388237376166,25.0791118960285],[121.386095778416,25.079457868769],[121.385404581636,25.0796564716476],[121.383130464779,25.0808411742995],[121.384329205825,25.0829032151584],[121.385216448995,25.0844694707149],[121.383194023104,25.08543538649],[121.382321367306,25.0857859464087],[121.382087472672,25.0859684213713],[121.381616505486,25.086431227312],[121.381316510193,25.0866016131379],[121.380817577345,25.0857928539832],[121.380540463049,25.0849104081824],[121.380492357258,25.0846613950793],[121.380082843112,25.0832801980329],[121.378878444765,25.0816897115419],[121.377420384892,25.0800433145904],[121.376271250382,25.0788453639494],[121.375376559168,25.0778560642726],[121.374500515457,25.0769427800948],[121.37338125336,25.0759514675032],[121.372429149656,25.0750275016768],[121.370632355818,25.073523811545],[121.368823485898,25.0720172244694],[121.36815421674,25.0726326419106],[121.367568844569,25.0731743678941],[121.36682902567,25.0738398643342],[121.364821853778,25.0726418529994],[121.363884368489,25.0719147505446],[121.363451536298,25.0715365173944],[121.362507695177,25.0704553513548],[121.361925500923,25.0695134971221],[121.361736732699,25.06915310355],[121.361301993758,25.0679343206259],[121.361129115115,25.0671248624405],[121.36100360263,25.0660234032094],[121.361007322891,25.0642613529163],[121.363807462916,25.0643009283854],[121.363830979496,25.0635213844618],[121.363904707153,25.0628017124777],[121.364170525257,25.0616444772056],[121.364360420341,25.0610796641951],[121.364688195301,25.0603204246698],[121.365116128821,25.0595067122841],[121.365960818955,25.0580989838079],[121.36839646232,25.0596927256068],[121.370438502928,25.0610566342981],[121.369905651156,25.0617530224598],[121.369300808916,25.0629433442583],[121.369069456615,25.0636348043809],[121.368797426985,25.064530645331],[121.36951690722,25.0647499987041],[121.371478808242,25.0652510685739],[121.372361892436,25.0654165692628],[121.373897982539,25.0657177972175],[121.375620168601,25.0658854866673],[121.376708531656,25.0658836060707],[121.377659364193,25.0657638552548],[121.378810405452,25.0654621747957],[121.380666944115,25.0648213892185],[121.38121990154,25.064650973083],[121.382328358722,25.0644298923377],[121.383223895517,25.0643930455081],[121.386250542937,25.0648398125703],[121.387624673916,25.0649181117846],[121.388881857578,25.0648444184078],[121.390061500084,25.0646279438573],[121.391238600256,25.0642180229158],[121.392383921267,25.0635950786344],[121.393758052246,25.0624700862047],[121.395062269068,25.0610998153514],[121.396252080906,25.0597364382184],[121.396908002816,25.0588728046527],[121.397870275851,25.0576740711765],[121.398693991739,25.0569140611697],[121.399507538295,25.0563843544383],[121.400582945148,25.0558534938735],[121.401635471004,25.0554849992879],[121.402510033552,25.0553329949485],[121.403122735801,25.0552915391868],[121.404027806345,25.0553145701673],[121.405300244004,25.0555080302319],[121.406647680487,25.0560008913976],[121.408002743969,25.0567332702165],[121.409329841788,25.0575761913643],[121.410834902916,25.0584352279896],[121.415419859692,25.0612651927852],[121.416803029601,25.06218797287],[121.420604910806,25.064395190352],[121.422270470211,25.0654430157037],[121.423731639819,25.0662702399138],[121.425079742731,25.0669556500276],[121.426132132747,25.0673810750659],[121.427036666314,25.0676568127275],[121.428179020455,25.0678872501542],[121.429772825995,25.068029057586],[121.431581893129,25.0680684485102],[121.434643391355,25.0681787430303],[121.438197341664,25.0687541187687],[121.439364963689,25.0688410686421],[121.441359423917,25.0692924251524],[121.451033000931,25.0721882060518],[121.458606610897,25.0744241856489],[121.459982013043,25.0748812784086],[121.461915457279,25.0753003745528],[121.464048474655,25.0755674900282],[121.467405625363,25.0755720954623],[121.468587618412,25.0754289449528],[121.470526339104,25.0752036601853],[121.47272897877,25.0746566696255],[121.476082607846,25.0737621465108],[121.478603331002,25.0732083336304],[121.481507946439,25.0730149015144],[121.483176988044,25.0730885899755],[121.48525915876,25.0733833433768],[121.490350180566,25.0745727121987],[121.493849701921,25.0752681364388],[121.496484830062,25.0758357562768],[121.499873759933,25.0768351285238],[121.504008228952,25.077735478988],[121.506225143316,25.0779841677793],[121.509319162561,25.0781131173241],[121.510210250272,25.0780210105202],[121.511527178759,25.0775881076141],[121.512626737776,25.0770953332943],[121.513004274224,25.076961777296],[121.513456809496,25.0768558534696],[121.513777143452,25.0765242652467],[121.513727567959,25.0754086024449],[121.513615705308,25.0685071558677],[121.518524950304,25.0684426760547],[121.518582152797,25.0706073369336],[121.519893996618,25.0706223052002],[121.520087213925,25.071884238629],[121.517092345667,25.0719809556181],[121.5139157006,25.0720534933098],[121.513961462594,25.0753671534763],[121.513965911677,25.0760890543413],[121.514235398973,25.0763653789049],[121.514555732929,25.076614070479],[121.515221824172,25.077023949934],[121.515543336594,25.0774492493337],[121.51555232746,25.0780889392947],[121.515465888139,25.0784205232803],[121.514964821008,25.0789385991357],[121.514703188243,25.0791573733663],[121.514225229641,25.0793646116539],[121.513554053733,25.0794290857163],[121.513035417803,25.0793277693173],[121.512587967198,25.0791896104563],[121.51218119392,25.0789915824836],[121.511462878593,25.0786352145343],[121.51088714643,25.0784343392602],[121.509965550722,25.0782823633954],[121.508267272287,25.0782593367328],[121.505942308771,25.0781626247025],[121.503228368308,25.0778160726331],[121.501110604931,25.0774568548349],[121.49933478534,25.0770377660715],[121.495036971426,25.0759969460148],[121.486310204652,25.073918866326],[121.483390544015,25.0734017654408],[121.481940143047,25.0733372882046],[121.47955004289,25.0734223980525],[121.477843173439,25.0736792474448],[121.472729270637,25.0749365439163],[121.470083973164,25.0756227552262],[121.468346288568,25.0758115777978],[121.466546316814,25.0759543458904],[121.465151847171,25.0759267133694],[121.463798054855,25.0758207886475],[121.461859525953,25.0756227552262],[121.460215907677,25.0752497146555],[121.455100733709,25.0737609951353],[121.447402549426,25.071404106731],[121.441867890514,25.0698232274917],[121.440698417341,25.0694962258888],[121.439561994496,25.0691772833436],[121.435612340324,25.0689330761043],[121.432598678007,25.0686809757504],[121.430946164759,25.068562803531],[121.428463046169,25.0684288748778],[121.427210615076,25.0682555552268],[121.42522759918,25.0677119601853],[121.423862101391,25.0670895802916],[121.420965854489,25.0652224216376],[121.416577004498,25.0623478742957],[121.409877745095,25.0581550162532],[121.407299788898,25.0565858735733],[121.40618624705,25.0560147099064],[121.404795590906,25.0555909415947],[121.403838402537,25.0554619683395],[121.402820198176,25.0554988178548],[121.401864280973,25.0556277910713],[121.400790145286,25.0559686482044],[121.399956260067,25.056341747493],[121.399219832408,25.0567757552757],[121.397940882885,25.0578791652996],[121.396540128647,25.0596446006729],[121.394862695928,25.0616352591476],[121.393529242277,25.0629260720987],[121.392507224417,25.0637505271343],[121.391241623482,25.064499416798],[121.389475455094,25.0649959212404],[121.387583996588,25.065125374169],[121.386113256956,25.0650378634272],[121.384237852288,25.0647200856875],[121.382363951384,25.0646003087808],[121.381265663534,25.0648282979758],[121.379304761272,25.0654924236705],[121.37902332584,25.065611863666],[121.377918682157,25.0659273611473],[121.377038399361,25.0660885639263],[121.375853672189,25.0661415305074],[121.374121707842,25.0659803277981],[121.372057380645,25.0659337574747],[121.370032365233,25.0658605770767],[121.368425610786,25.0658772730978],[121.368519677106,25.0647966328352],[121.368601938734,25.0644615219996],[121.369059287283,25.0628731041274],[121.369626863122,25.0617872556698],[121.370160725325,25.0610726790434],[121.368184724735,25.0598089831607],[121.366001496283,25.0583454094286],[121.364833294276,25.0603835836475],[121.364339446093,25.0616058961613],[121.364051526883,25.062802288217],[121.36397271456,25.0642289618351],[121.36399813789,25.0648167833801],[121.364127796872,25.0657160700407],[121.363955553812,25.0657943686949],[121.363229717745,25.0658243064024],[121.361179961775,25.0658841817955],[121.361177419442,25.0661956485122],[121.361277663242,25.067037085029],[121.361451991404,25.0678399033037],[121.361909611342,25.0691600120629],[121.362378036194,25.0699786680884],[121.362948154367,25.07069311659],[121.363588822279,25.0713707161933],[121.364032459385,25.0718807844494],[121.36495151276,25.0725405309843],[121.366801060008,25.0736326166956],[121.367765239793,25.0727748380171],[121.368852087144,25.0717685235596],[121.371429377209,25.0739786049185],[121.372587409885,25.0749676307535],[121.373367906111,25.0757211962984],[121.374681656682,25.0768817587618],[121.376420612445,25.0787273528003],[121.378122704379,25.0805280178619],[121.37939611481,25.082013773344],[121.37977712757,25.0824760221059],[121.380248747825,25.0832548531629],[121.380492158723,25.0839300972664],[121.380888222586,25.0854060283738],[121.381020963984,25.0857560135813],[121.381451253842,25.0864703700227],[121.38156057416,25.0863920845887],[121.38227306298,25.0857629211575],[121.383160972775,25.0854031510448],[121.384979376444,25.0845270344431],[121.383872438138,25.0825102067815],[121.382855892817,25.0807974245512],[121.385333396312,25.079501618996],[121.386059867963,25.0793044550205],[121.38815411476,25.0789679802911],[121.389817436117,25.0787912515342],[121.391807447262,25.0785379590599],[121.393041749927,25.0784849978399],[121.394194697936,25.0784458525756],[121.395717555395,25.0782639420657],[121.396750378171,25.0780509452391],[121.396592753526,25.0774424630742],[121.39641733255,25.0767528079201],[121.396152929919,25.0757868236359],[121.396887664152,25.0756532662103],[121.397347826423,25.0754690488325],[121.397731718704,25.0751881167977],[121.398108619569,25.0747615363896],[121.398426411192,25.07405862535],[121.398615078476,25.0734022141835],[121.398718779486,25.0723039207248],[121.398759456813,25.0717990355039],[121.398746745148,25.071191097972],[121.398708610154,25.0706597258584],[121.398627255498,25.0701525310406],[121.398553527841,25.069613670227],[121.398421326526,25.0690696256543],[121.39819052553,25.0681935146103],[121.397837192105,25.0681935146103],[121.397455239991,25.0682302378592]]";
    //   const routeNodes = JSON.parse(GeoJSON);
    //   routeNodes.forEach((n) => {
    //     pathPoints.pushPoint({
    //       lat: n[1],
    //       lng: n[0],
    //     });
    //   });

    //   const polyObject = new H.map.Polyline(pathPoints, {
    //     style: { lineWidth: 5, strokeColor: "#00DCD1" },
    //   });
    //   this.mapObject.map.addObject(polyObject);
    // },
    drawStopMarker(stopObjects) {
      this.mapObject.stopGroup.removeAll();
      if (stopObjects.length === 0) {
        return;
      }

      const H = window.H;
      const markers = stopObjects.map((s) => {
        const marker = document.createElement("div");
        marker.innerHTML = `
          <div class="stop-marker">
            <img src="${require("../assets/icons/bus-stop-marker.svg")}" />
            <div>${s.stopSequence}</div>
          </div>
        `;
        return new H.map.DomMarker(
          {
            lat: s.stopPosition.positionLat,
            lng: s.stopPosition.positionLon,
          },
          {
            icon: new H.map.DomIcon(marker),
            zIndex: 2,
            data: s,
          }
        );
      });
      this.mapObject.stopGroup.addObjects(markers);
    },
    drawBusMarker(stopObjects) {
      this.mapObject.busGroup.removeAll();
      if (stopObjects.length === 0) {
        return;
      }

      const H = window.H;
      const markers = stopObjects.map((s) => {
        const marker = document.createElement("div");
        marker.innerHTML = `
          <div class="bus-marker">
            <img src="${require("../assets/icons/bus-icon.svg")}"/>
          </div>
        `;
        return new H.map.DomMarker(
          {
            lat: s.stopPosition.positionLat,
            lng: s.stopPosition.positionLon,
          },
          {
            icon: new H.map.DomIcon(marker),
            zIndex: 3,
            data: s,
          }
        );
      });
      this.mapObject.busGroup.addObjects(markers);

      this.$nextTick(() => {
        this.updateInfoBox();
      });
    },
    setCenter(lng, lat) {
      this.mapObject.map.setCenter({ lat, lng });
    },
    openInfoBox(stopInfo) {
      this.activeStop = stopInfo;
      this.$nextTick(() => {
        this.updateInfoBox();
        this.mapObject.map.getViewModel().setLookAtData({
          zoom: this.mapObject.map.getZoom(),
          bounds: this.mapObject.infoGroup.getBoundingBox()
        }, true);
      });
    },
    hideInfoBox() {
      if (this.activeStop !== null) {
        this.activeStop = null;
        this.clearInfoBox();
      }
    },
    updateInfoBox() {
      if (this.activeStop === null) {
        return;
      }

      const H = window.H;
      const infoBlock = this.$refs.stopInfoBox.cloneNode(true);
      infoBlock.style.display = "";

      const closeMethod = () => {
        this.hideInfoBox();
      };

      const markObject = new H.map.DomMarker(
        {
          lat: this.activeStop.stopPosition.positionLat,
          lng: this.activeStop.stopPosition.positionLon,
        },
        {
          icon: new H.map.DomIcon(infoBlock, {
            onAttach: function (clonedElement) {
              clonedElement
                .querySelector(".map-close-btn")
                .addEventListener("click", closeMethod);
            },
            // the function is called every time marker leaves the viewport
            onDetach: function (clonedElement) {
              clonedElement
                .querySelector(".map-close-btn")
                .removeEventListener("click", closeMethod);
            },
          }),
          zIndex: 4,
        }
      );
      this.clearInfoBox();
      this.mapObject.infoGroup.addObject(markObject);
    },
    clearInfoBox() {
      this.mapObject.infoGroup.removeAll();
    },
    setupCurrentBusStopData() {
      if (this.currentData.busStops == this.busStops) {
        return false;
      }
      this.currentData.busStops = this.busStops;
      return true;
    },
    setupCurrentArrivalInfoData() {
      if (this.currentData.arrivalInfos == this.arrivalInfos) {
        return false;
      }
      this.currentData.arrivalInfos = this.arrivalInfos;
      return true;
    },
  },
  computed: {
    stops() {
      if (this.initialized && this.setupCurrentBusStopData()) {
        this.hideInfoBox();
        this.drawStopMarker(this.busStops);
        const rect = this.mapObject.stopGroup.getBoundingBox();
        this.mapObject.map.getViewModel().setLookAtData({
          position: rect.getCenter(),
          bounds: rect
        }, true);
      }
      return this.busStops;
    },
    busPositions() {
      const result = [];
      if (this.initialized && this.setupCurrentArrivalInfoData()) {
        this.stops.forEach((s) => {
          if (
            !this.arrivalInfos[s.stopUID] ||
            this.arrivalInfos[s.stopUID].plateNumbers.length === 0
          ) {
            return;
          }
          result.push(s);
        });
        this.drawBusMarker(result);
      }
      return result;
    },
    currentArrivalInfo() {
      return (
        this.arrivalInfos[this.activeStop.stopUID] || {
          stopUID: this.activeStop.stopUID,
          estimateTime: Number.MAX_SAFE_INTEGER,
          stopStatus: "1",
          plateNumbers: [],
        }
      );
    },
  },
};
</script>

<style lang="scss">
.here-map {
  width: 100%;
  height: 100%;

  & .map-container {
    width: 100%;
    height: 100%;
  }

  & .stop-marker {
    position: relative;
    display: block;
    margin: -150% -50%;
    width: 2rem;
    & > img {
      width: 100%;
    }
    & > div {
      position: absolute;
      display: inline-block;
      top: 0.5rem;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      margin: auto;
      color: #fff;
      font-size: 0.675rem;
    }
  }

  & .bus-marker {
    position: relative;
    display: block;
    margin: -75% -50%;
    width: 1.25rem;
    & > img {
      width: 100%;
    }
  }

  & .map-info-box {
    position: relative;
    width: 100%;
    max-width: 20rem;
    padding: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.97);
    border-radius: 0.5rem;
    text-align: left;
    margin: -43% -50%;
    box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);
    

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: auto;
      border-style: solid;
      border-width: 0.5rem 0.8rem 0 0.5rem;
      width: 0;
      z-index: 5;
      border-color: #ffffff transparent transparent transparent;
      box-shadow: 0px 5px 20px rgba(228, 231, 240, 0.8);
      opacity: 0.97;
    }

    & > .map-close-btn {
      cursor: pointer;
      position: absolute;
      display: block;
      width: 1rem;
      height: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 1rem;
      right: 1rem;
    }

    & > .map-stop-name {
      flex: 0 0 100%;
      max-width: 100%;
      color: #5468ff;
      font-size: 1.25rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
    }

    & > .map-route-info {
      flex-basis: 0;
      flex-grow: 1;
      max-height: 100%;

      & > .map-route-name {
        padding: 0.5rem 0 0.25rem;
        color: #040d2e;
        display: block;
        overflow: hidden;
        font-size: 1rem;
        font-weight: 700;
        white-space: nowrap;
      }

      & > .map-head-sign {
        color: #040d2e;
        display: block;
        overflow: hidden;
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
      }
    }

    & > .map-arrival-tag {
      flex: 0 0 auto;
      width: auto;
      max-width: 100%;
    }
  }
}
</style>