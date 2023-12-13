import * as React from 'react';
import { Container, Row, Col, Form} from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { TbListDetails } from "react-icons/tb";
import API_ENDPOINTS from './apiConfig';
// the timezones for calendar
const timezones = [
  'UTC',
  'America/Adak' ,
  'America/Atka' ,
  'America/Anchorage' ,
  'America/Juneau' ,
  'America/Nome' ,
  'America/Yakutat' ,
  'America/Dawson' ,
  'America/Ensenada' ,
  'America/Los_Angeles' ,
  'America/Tijuana' ,
  'America/Vancouver' ,
  'America/Whitehorse' ,
  'America/Boise' ,
  'America/Cambridge_Bay' ,
  'America/Chihuahua' ,
  'America/Dawson_Creek' ,
  'America/Denver' ,
  'America/Edmonton' ,
  'America/Hermosillo' ,
  'America/Inuvik' ,
  'America/Mazatlan' ,
  'America/Phoenix' ,
  'America/Shiprock' ,
  'America/Yellowknife' ,
  'America/Belize' ,
  'America/Cancun' ,
  'America/Chicago' ,
  'America/Costa_Rica' ,
  'America/El_Salvador' ,
  'America/Guatemala' ,
  'America/Knox_IN' ,
  'America/Managua' ,
  'America/Menominee' ,
  'America/Merida' ,
  'America/Mexico_City' ,
  'America/Monterrey' ,
  'America/Rainy_River' ,
  'America/Rankin_Inlet' ,
  'America/Regina' ,
  'America/Swift_Current' ,
  'America/Tegucigalpa' ,
  'America/Winnipeg' ,
  'America/Atikokan' ,
  'America/Bogota' ,
  'America/Cayman' ,
  'America/Coral_Harbour' ,
  'America/Detroit' ,
  'America/Fort_Wayne' ,
  'America/Grand_Turk' ,
  'America/Guayaquil' ,
  'America/Havana' ,
  'America/Indianapolis' ,
  'America/Iqaluit' ,
  'America/Jamaica' ,
  'America/Lima' ,
  'America/Louisville' ,
  'America/Montreal' ,
  'America/Nassau' ,
  'America/New_York' ,
  'America/Nipigon' ,
  'America/Panama' ,
  'America/Pangnirtung' ,
  'America/Port-au-Prince' ,
  'America/Resolute' ,
  'America/Thunder_Bay' ,
  'America/Toronto' ,
  'America/Caracas' ,
  'America/Anguilla' ,
  'America/Antigua' ,
  'America/Aruba' ,
  'America/Asuncion' ,
  'America/Barbados' ,
  'America/Blanc-Sablon' ,
  'America/Boa_Vista' ,
  'America/Campo_Grande' ,
  'America/Cuiaba' ,
  'America/Curacao' ,
  'America/Dominica' ,
  'America/Eirunepe' ,
  'America/Glace_Bay' ,
  'America/Goose_Bay' ,
  'America/Grenada' ,
  'America/Guadeloupe' ,
  'America/Guyana' ,
  'America/Halifax' ,
  'America/La_Paz' ,
  'America/Manaus' ,
  'America/Marigot' ,
  'America/Martinique' ,
  'America/Moncton' ,
  'America/Montserrat' ,
  'America/Port_of_Spain' ,
  'America/Porto_Acre' ,
  'America/Porto_Velho' ,
  'America/Puerto_Rico' ,
  'America/Rio_Branco' ,
  'America/Santiago' ,
  'America/Santo_Domingo' ,
  'America/St_Barthelemy' ,
  'America/St_Kitts' ,
  'America/St_Lucia' ,
  'America/St_Thomas' ,
  'America/St_Vincent' ,
  'America/Thule' ,
  'America/Tortola' ,
  'America/Virgin' ,
  'America/St_Johns' ,
  'America/Araguaina' ,
  'America/Bahia' ,
  'America/Belem' ,
  'America/Buenos_Aires' ,
  'America/Catamarca' ,
  'America/Cayenne' ,
  'America/Cordoba' ,
  'America/Fortaleza' ,
  'America/Godthab' ,
  'America/Jujuy' ,
  'America/Maceio' ,
  'America/Mendoza' ,
  'America/Miquelon' ,
  'America/Montevideo' ,
  'America/Paramaribo' ,
  'America/Recife' ,
  'America/Rosario' ,
  'America/Santarem' ,
  'America/Sao_Paulo' ,
  'America/Noronha' ,
  'America/Scoresbysund' ,
  'America/Danmarkshavn' ,
  'Canada/Pacific' ,
  'Canada/Yukon' ,
  'Canada/Mountain' ,
  'Canada/Central' ,
  'Canada/East-Saskatchewan' ,
  'Canada/Saskatchewan' ,
  'Canada/Eastern' ,
  'Canada/Atlantic' ,
  'Canada/Newfoundland' ,
  'Mexico/BajaNorte' ,
  'Mexico/BajaSur' ,
  'Mexico/General' ,
  'Chile/EasterIsland' ,
  'Chile/Continental' ,
  'Antarctica/Palmer' ,
  'Antarctica/Rothera' ,
  'Antarctica/Syowa' ,
  'Antarctica/Mawson' ,
  'Antarctica/Vostok' ,
  'Antarctica/Davis' ,
  'Antarctica/Casey' ,
  'Antarctica/DumontDUrville' ,
  'Antarctica/McMurdo' ,
  'Antarctica/South_Pole' ,
  'Atlantic/Bermuda' ,
  'Atlantic/Stanley' ,
  'Atlantic/South_Georgia' ,
  'Atlantic/Azores' ,
  'Atlantic/Cape_Verde' ,
  'Atlantic/Canary' ,
  'Atlantic/Faeroe' ,
  'Atlantic/Faroe' ,
  'Atlantic/Madeira' ,
  'Atlantic/Reykjavik' ,
  'Atlantic/St_Helena' ,
  'Atlantic/Jan_Mayen' ,
  'Brazil/Acre' ,
  'Brazil/West' ,
  'Brazil/East' ,
  'Brazil/DeNoronha' ,
  'Africa/Abidjan' ,
  'Africa/Accra' ,
  'Africa/Bamako' ,
  'Africa/Banjul' ,
  'Africa/Bissau' ,
  'Africa/Casablanca' ,
  'Africa/Conakry' ,
  'Africa/Dakar' ,
  'Africa/El_Aaiun' ,
  'Africa/Freetown' ,
  'Africa/Lome' ,
  'Africa/Monrovia' ,
  'Africa/Nouakchott' ,
  'Africa/Ouagadougou' ,
  'Africa/Sao_Tome' ,
  'Africa/Timbuktu' ,
  'Africa/Algiers' ,
  'Africa/Bangui' ,
  'Africa/Brazzaville' ,
  'Africa/Ceuta' ,
  'Africa/Douala' ,
  'Africa/Kinshasa' ,
  'Africa/Lagos' ,
  'Africa/Libreville' ,
  'Africa/Luanda' ,
  'Africa/Malabo' ,
  'Africa/Ndjamena' ,
  'Africa/Niamey' ,
  'Africa/Porto-Novo' ,
  'Africa/Tunis' ,
  'Africa/Windhoek' ,
  'Africa/Blantyre' ,
  'Africa/Bujumbura' ,
  'Africa/Cairo' ,
  'Africa/Gaborone' ,
  'Africa/Harare' ,
  'Africa/Johannesburg' ,
  'Africa/Kigali' ,
  'Africa/Lubumbashi' ,
  'Africa/Lusaka' ,
  'Africa/Maputo' ,
  'Africa/Maseru' ,
  'Africa/Mbabane' ,
  'Africa/Tripoli' ,
  'Africa/Addis_Ababa' ,
  'Africa/Asmara' ,
  'Africa/Asmera' ,
  'Africa/Dar_es_Salaam' ,
  'Africa/Djibouti' ,
  'Africa/Kampala' ,
  'Africa/Khartoum' ,
  'Africa/Mogadishu' ,
  'Africa/Nairobi' ,
  'Europe/Belfast' ,
  'Europe/Dublin' ,
  'Europe/Guernsey' ,
  'Europe/Isle_of_Man' ,
  'Europe/Jersey' ,
  'Europe/Lisbon' ,
  'Europe/London' ,
  'Europe/Amsterdam' ,
  'Europe/Andorra' ,
  'Europe/Belgrade' ,
  'Europe/Berlin' ,
  'Europe/Bratislava' ,
  'Europe/Brussels' ,
  'Europe/Budapest' ,
  'Europe/Copenhagen' ,
  'Europe/Gibraltar' ,
  'Europe/Ljubljana' ,
  'Europe/Luxembourg' ,
  'Europe/Madrid' ,
  'Europe/Malta' ,
  'Europe/Monaco' ,
  'Europe/Oslo' ,
  'Europe/Paris' ,
  'Europe/Podgorica' ,
  'Europe/Prague' ,
  'Europe/Rome' ,
  'Europe/San_Marino' ,
  'Europe/Sarajevo' ,
  'Europe/Skopje' ,
  'Europe/Stockholm' ,
  'Europe/Tirane' ,
  'Europe/Vaduz' ,
  'Europe/Vatican' ,
  'Europe/Vienna' ,
  'Europe/Warsaw' ,
  'Europe/Zagreb' ,
  'Europe/Zurich' ,
  'Europe/Athens' ,
  'Europe/Bucharest' ,
  'Europe/Chisinau' ,
  'Europe/Helsinki' ,
  'Europe/Istanbul' ,
  'Europe/Kaliningrad' ,
  'Europe/Kiev' ,
  'Europe/Mariehamn' ,
  'Europe/Minsk' ,
  'Europe/Nicosia' ,
  'Europe/Riga' ,
  'Europe/Simferopol' ,
  'Europe/Sofia' ,
  'Europe/Tallinn' ,
  'Europe/Tiraspol' ,
  'Europe/Uzhgorod' ,
  'Europe/Vilnius' ,
  'Europe/Zaporozhye' ,
  'Europe/Moscow' ,
  'Europe/Volgograd' ,
  'Europe/Samara' ,
  'Arctic/Longyearbyen' ,
  'Asia/Amman' ,
  'Asia/Beirut' ,
  'Asia/Damascus' ,
  'Asia/Gaza' ,
  'Asia/Istanbul' ,
  'Asia/Jerusalem' ,
  'Asia/Nicosia' ,
  'Asia/Tel_Aviv' ,
  'Asia/Aden' ,
  'Asia/Baghdad' ,
  'Asia/Bahrain' ,
  'Asia/Kuwait' ,
  'Asia/Qatar' ,
  'Asia/Tehran' ,
  'Asia/Baku' ,
  'Asia/Dubai' ,
  'Asia/Muscat' ,
  'Asia/Tbilisi' ,
  'Asia/Yerevan' ,
  'Asia/Kabul' ,
  'Asia/Aqtau' ,
  'Asia/Aqtobe' ,
  'Asia/Ashgabat' ,
  'Asia/Ashkhabad' ,
  'Asia/Dushanbe' ,
  'Asia/Karachi' ,
  'Asia/Oral' ,
  'Asia/Samarkand' ,
  'Asia/Tashkent' ,
  'Asia/Yekaterinburg' ,
  'Asia/Calcutta' ,
  'Asia/Colombo' ,
  'Asia/Kolkata' ,
  'Asia/Katmandu' ,
  'Asia/Almaty' ,
  'Asia/Bishkek' ,
  'Asia/Dacca' ,
  'Asia/Dhaka' ,
  'Asia/Novosibirsk' ,
  'Asia/Omsk' ,
  'Asia/Qyzylorda' ,
  'Asia/Thimbu' ,
  'Asia/Thimphu' ,
  'Asia/Rangoon' ,
  'Asia/Bangkok' ,
  'Asia/Ho_Chi_Minh' ,
  'Asia/Hovd' ,
  'Asia/Jakarta' ,
  'Asia/Krasnoyarsk' ,
  'Asia/Phnom_Penh' ,
  'Asia/Pontianak' ,
  'Asia/Saigon' ,
  'Asia/Vientiane' ,
  'Asia/Brunei' ,
  'Asia/Choibalsan' ,
  'Asia/Chongqing' ,
  'Asia/Chungking' ,
  'Asia/Harbin' ,
  'Asia/Hong_Kong' ,
  'Asia/Irkutsk' ,
  'Asia/Kashgar' ,
  'Asia/Kuala_Lumpur' ,
  'Asia/Kuching' ,
  'Asia/Macao' ,
  'Asia/Macau' ,
  'Asia/Makassar' ,
  'Asia/Manila',
  'Asia/Shanghai' ,
  'Asia/Singapore' ,
  'Asia/Taipei' ,
  'Asia/Ujung_Pandang',
  'Asia/Ulaanbaatar',
  'Asia/Ulan_Bator' ,
  'Asia/Urumqi' ,
  'Asia/Dili' ,
  'Asia/Jayapura' ,
  'Asia/Pyongyang' ,
  'Asia/Seoul' ,
  'Asia/Tokyo',
  'Asia/Yakutsk' ,
  'Asia/Sakhalin',
  'Asia/Vladivostok' ,
  'Asia/Magadan' ,
  'Asia/Anadyr' ,
  'Asia/Kamchatka' ,
  'Indian/Antananarivo' ,
  'Indian/Comoro' ,
  'Indian/Mayotte' ,
  'Indian/Mahe' ,
  'Indian/Mauritius' ,
  'Indian/Reunion',
  'Indian/Kerguelen' ,
  'Indian/Maldives' ,
  'Indian/Chagos' ,
  'Indian/Cocos' ,
  'Indian/Christmas' ,
  'Australia/Perth' ,
  'Australia/West',
  'Australia/Eucla',
  'Australia/Adelaide' ,
  'Australia/Broken_Hill',
  'Australia/Darwin' ,
  'Australia/North',
  'Australia/South' ,
  'Australia/Yancowinna' ,
  'Australia/ACT' ,
  'Australia/Brisbane',
  'Australia/Canberra',
  'Australia/Currie' ,
  'Australia/Hobart',
  'Australia/Lindeman' ,
  'Australia/Melbourne' ,
  'Australia/NSW' ,
  'Australia/Queensland' ,
  'Australia/Sydney' ,
  'Australia/Tasmania' ,
  'Australia/Victoria' ,
  'Australia/LHI' ,
  'Australia/Lord_Howe' ,
  'Pacific/Apia' ,
  'Pacific/Auckland' ,
  'Pacific/Bougainville' ,
  'Pacific/Chatham' ,
  'Pacific/Chuuk' ,
  'Pacific/Easter' ,
  'Pacific/Efate' ,
  'Pacific/Enderbury' ,
  'Pacific/Fakaofo' ,
  'Pacific/Fiji' ,
  'Pacific/Funafuti' ,
  'Pacific/Galapagos' ,
  'Pacific/Gambier' ,
  'Pacific/Guadalcanal' ,
  'Pacific/Guam' ,
  'Pacific/Honolulu',
  'Pacific/Kiritimati' ,
  'Pacific/Kosrae' ,
  'Pacific/Kwajalein',
  'Pacific/Majuro' ,
  'Pacific/Marquesas' ,
  'Pacific/Nauru' ,
  'Pacific/Niue' ,
  'Pacific/Norfolk',
  'Pacific/Noumea' ,
  'Pacific/Pago_Pago' ,
  'Pacific/Palau' ,
  'Pacific/Pitcairn' ,
  'Pacific/Pohnpei' ,
  'Pacific/Port_Moresby',
  'Pacific/Rarotonga',
  'Pacific/Tahiti' ,
  'Pacific/Tarawa',
  'Pacific/Tongatapu' ,
  'Pacific/Wake',
  'Pacific/Wallis'
];

function Copyright() {
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs="auto" className="text-secondary text-center">
          {'Copyright © '}
          <a href="https://appfoster.com/" className="text-inherit">
            Skoop
          </a>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Col>
      </Row>
    </Container>
  );
}

export default function SignUp(props) {
  const [selectedOption,setSelectedOption]=React.useState("")
  const handleSubmit = async(event) => {
    event.preventDefault();
    try{
      const data = new FormData(event.currentTarget);
      if(data.get("password")!==data.get("confirmPassword")){
        alert("Password fields do not match try again")
        return ;
      }
      if(data.get("timezone")=="Select Timezone"){
        alert("please select a timezone")
        return ;
      }
      const res=await fetch(API_ENDPOINTS.signUp,{
          method: "POST",
          body: JSON.stringify({
              password : data.get("password"),
              first_name: data.get("firstName"),
              last_name: data.get("lastName"),
              email: data.get("email"),
              timezone: data.get("timezone"),
              services: [1,2,3]
          }),
          headers:{
              "Content-type": "application/json; charset=UTF-8"
          }
      })
      if(res.ok){
          alert("sign-up was successfull")
      }
      else alert("username already exists pick a different username")
    }catch(err){
      console.log(err)
      alert("some error occurred")
    }
  };

  return (
    <div>
    <FaTimes style={{ cursor: 'pointer', fontSize: '2rem', position: 'absolute', top: '2', right: '3' }} onClick={props.close} />
    <Container style={{ maxWidth: '90%', height: '70%', marginTop: '7rem', borderRadius: '1rem', position: 'relative' }}>
      <Row className="justify-content-md-center">
      <Col xs={12} md={10}>
      <div className="text-center mb-4">
            <TbListDetails style={{ fontSize:"16px" }}/> 
            <h2>Sign Up</h2>
          </div>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                required
                name="firstName"
                autoComplete="given-name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                required
                name="lastName"
                autoComplete="family-name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email Address"
                required
                name="email"
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="timezone">
              <Form.Select
                value={selectedOption}
                required
                name="timezone"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option>Select Timezone</option>
                {timezones.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <br></br>
            <button 
            type="submit" 
            className=" w-100 mb-2" 
            style={{ fontSize: '1.5rem', color:'#FFFFFF', backgroundColor:'#0a66c2', border: '1' }}>
              Sign Up
            </button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-center">
        <Col xs={12} className="text-center">
          <p>
            Already have an account?{' '}
            <a
                href="#"
                className="text-secondary"
                onClick={() => {
                  props.changePage('SignIn');
                }}
              >
                Sign in
              </a>
          </p>
        </Col>
      </Row>
      <Copyright/>
    </Container>
    </div>
  );
}