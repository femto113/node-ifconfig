node-ifconfig
=============

exec ifconfig and parse results into nested objects

## Motivation

Much useful information about a systems network interfaces (including their physical
MAC addresses) can be had via the `ifconfig` tool but its output format defies
naive parsing approaches, so some custom code is warranted.

## Install

This hasn't been published to npm yet, so for now you'll have to clone it

    % git clone https://github.com/femto113/node-ifconfig.git
    % cd node-ifconfig
    % sudo npm link

## Usage

The module's exports consist of a single function, which simply execs ifconfig
and passes the parsed output to your method.

    var ifconfig = require("ifconfig");

    ifconfig(function (err, results) {
       console.log("%s", JSON.stringify(results, null, "  "));
    });

will output something like

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
        "flags": "8863<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 1500",
        "options": "2b<RXCSUM,TXCSUM,VLAN_HWTAGGING,TSO4>",
        "ether": "41:7c:9f:14:56:8c",
        "inet6": "fe90::436c:8fff:fe12:567c%en1 prefixlen 64 scopeid 0x7",
        "inet": "10.0.0.140 netmask 0xffffff00 broadcast 10.0.0.255",
        "media": "autoselect (1000baseT <full-duplex>)",
        "status": "active"
      }
    }

Behavior isn't well defined if something called `ifconfig` isn't in your path or
it doesn't produce the expected output format when called with no arguments.
So far tested only on Mac OS X.

Here's a slightly fancier example, which prints only the MAC addresses of the active interfaces:
   
    var ifconfig = require("ifconfig");

    ifconfig(function (err, results) {
       Object.keys(results).filter(function (key) {
         return results[key].status == 'active' && 'ether' in results[key];
       }).map(function (key) {
         return results[key].ether;
       }).forEach(function (mac) { console.log(mac); });
    });
