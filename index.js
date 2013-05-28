
var exec = require("child_process").exec;

module.exports = function (callback) {

  exec("ifconfig", function (err, stdout, stderr) {
    if (err) {
      callback(err, stderr);
    } else {
      // ifconfig emits a kind of mish-mash formats, the following gobbledygook turns that into nested objects in
      // a (hopefully) intuitive way (see sample below). 
      var results = stdout.split('\n').reduce(function (a, line) {
          if (/^\t/.test(line)) { // tabs indicate "features" of previous unindented line
            a[a.length - 1].push(line.replace(/^\t/,'').trim());
          } else if (line) {
            a.push(line.split(':').map(function (s) { return s.trim(); })); // unindented lines start with a name followed by a :
          }
          return a;
        }, []).reduce(function (o, a) {
          o[a.shift()] = a.map(function (l) {
            return l.match(/^([^ =:]+)[ =:](?:[ ]?)(.*)$/).slice(1,3); // indented lines start with a name followed by a space, :, or =
          }).reduce(function (p,b) {
            p[b[0]] = b[1];
            return p;
          }, {});
          return o;
          }, {});
      callback(null, results);
    }
  });

};

// given this sample output from ifconfig command
/*
 
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	options=3<RXCSUM,TXCSUM>
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1 
	inet 127.0.0.1 netmask 0xff000000 
	inet6 ::1 prefixlen 128 
en0: flags=8823<UP,BROADCAST,SMART,SIMPLEX,MULTICAST> mtu 1500
	ether 98:fe:94:42:4d:82 
	media: autoselect (<unknown type>)
	status: inactive
en1: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=2b<RXCSUM,TXCSUM,VLAN_HWTAGGING,TSO4>
	ether 40:6c:8f:04:54:7c 
	inet6 fe80::426c:8fff:fe04:547c%en1 prefixlen 64 scopeid 0x7 
	inet 10.0.0.140 netmask 0xffffff00 broadcast 10.0.0.255
	media: autoselect (1000baseT <full-duplex>)
	status: active
*/
// you'd get this result from the parser
/*
{
  "lo0": {
    "flags": "8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384",
    "options": "3<RXCSUM,TXCSUM>",
    "inet6": "::1 prefixlen 128",
    "inet": "127.0.0.1 netmask 0xff000000"
  },
  "en0": {
    "flags": "8823<UP,BROADCAST,SMART,SIMPLEX,MULTICAST> mtu 1500",
    "ether": "99:ff:99:42:4d:12",
    "media": "autoselect (<unknown type>)",
    "status": "inactive"
  },
  "en1": {
    "flags": "8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500",
    "options": "2b<RXCSUM,TXCSUM,VLAN_HWTAGGING,TSO4>",
    "ether": "41:7c:9f:14:56:8c",
    "inet6": "fe90::436c:8fff:fe12:567c%en1 prefixlen 64 scopeid 0x7",
    "inet": "10.0.0.140 netmask 0xffffff00 broadcast 10.0.0.255",
    "media": "autoselect (1000baseT <full-duplex>)",
    "status": "active"
  }
}
*/
