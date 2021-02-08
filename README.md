![Color-Wallet logo — spaceship blasting off](./public/img/main-logo-1024.png)

# Welcome to Boco Scan!

## Project running on testnet
[Boco Explorer by Boco Coin](http://scan.bococoin.com/)


## How to run Color Explorer

1. Copy `settings.json.default` to `settings.json`.
2. Update the RPC and LCD URLs.
3. Update Bech32 address prefixes.
4. Update genesis file location.

### Run in local

```
meteor npm install
meteor update
meteor --settings settings.json
```

### Run in production

```
./build.sh
```

It will create a packaged Node JS tarball at `./output`. Deploy that packaged Node JS project with process manager like [forever](https://www.npmjs.com/package/forever) or [Phusion Passenger](https://www.phusionpassenger.com/library/walkthroughs/basics/nodejs/fundamental_concepts.html).

