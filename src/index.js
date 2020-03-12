#!/usr/bin/env node

import fs from "fs";
import http from "http";
import https from "https";
import app from "./app/app";
import signsSuggestorDaemon from "./app/daemons/signsSuggestorDaemon";
import blendToBundleDaemon from "./app/daemons/blendToBundleDaemon";
import { serverInfo, serverWarning, serverError } from "./app/util/debugger";
import { createNewJob, runAllJobs } from "./app/cron";

const getSSL = function getSSLCertificates() {
  try {
    return {
      key: fs.readFileSync(process.env.SSLKEY),
      cert: fs.readFileSync(process.env.SSLCERT)
    };
  } catch (error) {
    serverWarning("Failed to get SSL certificates:", error.message);
    return {};
  }
};

const normalizePort = function normalizeServerPort(portValue) {
  const port = parseInt(portValue, 10);

  if (Number.isNaN(port)) {
    return portValue;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = function onErrorEvent(error, port) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      serverError(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      serverError(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = function onListeningEvent(addr) {
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  serverInfo(`Listening on ${bind}`);
};

const startHTTPServer = function startHTTPServerListen() {
  serverInfo("Starting HTTP Server");
  const httpServer = http.createServer(app);
  httpServer.listen(app.get("HTTPPort"));
  httpServer.on("error", err => {
    onError(err, app.get("HTTPPort"));
  });
  httpServer.on("listening", () => {
    onListening(httpServer.address());
  });

  serverInfo("Starting HTTPS Server");
  const httpSecureServer = https.createServer(getSSL(), app);
  httpSecureServer.listen(app.get("HTTPSPort"));
  httpSecureServer.on("error", err => {
    onError(err, app.get("HTTPSPort"));
  });
  httpSecureServer.on("listening", () => {
    onListening(httpSecureServer.address());
  });

  serverInfo("Starting Daemons");
  createNewJob(
    process.env.CRON_SIGNS_SUGGESTION_INTERVAL,
    "signsSuggestorDaemon",
    signsSuggestorDaemon
  );
  createNewJob(
    process.env.CRON_SIGNS_BUILD_INTERVAL,
    "blendToBundleDaemon",
    blendToBundleDaemon
  );
  runAllJobs();
};

app.set("HTTPPort", normalizePort(process.env.HTTPPORT || "80"));
app.set("HTTPSPort", normalizePort(process.env.HTTPSPORT || "443"));

startHTTPServer();
