import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Alert, Spinner } from "reactstrap";
import { TxIcon } from "../components/Icons.jsx";
import Activities from "../components/Activities.jsx";
import ColorErrors from "../components/ColorErrors.jsx";
import ButtonActivities from "../components/ButtonActivities.jsx";
import TimeAgo from "../components/TimeAgo.jsx";
import numbro from "numbro";
import moment from "moment";
import Coin from "/both/utils/coins.js";

export const TransactionRow = props => {
  let tx = props.tx;

  return (
    <Row className={tx.code ? "tx-info invalid" : "tx-info"}>
      {!props.blockList ? (
        <Col xs={4} md={4} lg={2}>
          <div className="mobile-padding-10">
              {tx.tx.value.msg && tx.tx.value.msg.length > 0
                  ? tx.tx.value.msg.map(msg => {
                      return (
                          <ButtonActivities
                              msg={msg}
                              invalid={!!tx.code}
                              tags={tx.tags}
                          />
                      );
                  })
                  : ""}
          </div>
        </Col>
      ) : (
        ""
      )}

      <Col className="resultpaddingleft"  xs={4} md={4} lg={1}>
        <div className="mobile-padding-10">
           {!tx.code ? <TxIcon valid /> : <TxIcon />}
        </div>
      </Col>

      {!props.blockList ? (
        <Col xs={4} md={4} lg={2}>
          <div className="mobile-padding-10">
              {tx.tx.value.msg && tx.tx.value.msg.length > 0
                  ? tx.tx.value.msg.map(msg => {
                      return (
                          <Activities msg={msg} invalid={!!tx.code} tags={tx.tags} />
                      );
                  })
                  : ""}
          </div>
        </Col>
      ) : (
        ""
      )}

      <Col
          xs={4} md={4} lg={2}
      >
        <div className="mobile-padding-10">
            <i className="material-icons d-lg-none">monetization_on</i>{" "}
            {tx.tx.value.fee.amount ? (
                tx.tx.value.fee.amount.map((fee, i) => {
                    return <span key={i}>{new Coin(fee.amount).toString()}</span>;
                })
            ) : (
                <span></span>
            )}
        </div>
      </Col>
      {!props.blockList ? (
        <Col xs={4} md={4} lg={2}>
          <div className="mobile-padding-10">
              <i className="fas fa-database d-lg-none"></i>{" "}
              <Link to={"/blocks/" + tx.height}>
                  {numbro(tx.height).format(window.config.numbers.decimalFormat)}
              </Link>
          </div>
        </Col>
      ) : (
        ""
      )}
      <Col
        xs={
          !props.blockList
            ? { size: 4, order: "first" }
            : { size: 4, order: "first" }
        }
        md={
          !props.blockList
            ? { size: 4, order: "first" }
            : { size: 4, order: "first" }
        }
        lg={
          !props.blockList
            ? { size: 1, order: "first" }
            : { size: 2, order: "first" }
        }
        className="text-truncate"
      >
        <div className="mobile-padding-10">
            <i className="fas fa-hashtag d-lg-none"></i>{" "}
            <Link to={"/transactions/" + tx.txhash}>{tx.txhash}</Link>
        </div>
      </Col>
      {!props.blockList ? (
        <Col md={12} lg={2}>
          <div className="mobile-padding-10">
              <span>
                {tx.block()
                    ? moment.utc(tx.block().time).format(window.config.dateTimeFormat.default)
                    : ""}
              </span>
          </div>
        </Col>
      ) : (
        ""
      )}
      {/* className="text-nowrap"                   <TimeAgo time={tx.block().time} /> */}
      {tx.code ? (
        <Col xs={{ size: 12, order: "last" }} className="error">
          <Alert color="danger">
            <ColorErrors
              code={tx.code}
              codespace={tx.codespace}
              raw_log={tx.raw_log}
              gasWanted={tx.gas_wanted}
              gasUses={tx.gas_used}
            />
          </Alert>
        </Col>
      ) : (
        ""
      )}
    </Row>
  );
};
