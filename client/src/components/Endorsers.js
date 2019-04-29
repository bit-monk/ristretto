import React, { Component } from "react";
import StakeMoney from "./StakeMoney";
import WithdrawStakeMoney from "./WithdrawStakeMoney";
import EndorseUser from "./EndorseUser";
import { Container, Col, Row, Form, FormGroup } from "reactstrap";
import { Heading } from "rimble-ui";


const TableRow = ({row}) => (
  <tr>
    <td key={row.name}>{row.name}</td>
    <td key={row.id}>{row.id}</td>
    <td key={row.price}>{row.price}</td>
  </tr>
)


class Endorsers extends Component {

    constructor(props) {
        super(props);
        const { drizzle, drizzleState } = this.props;

        this.state = {
          account: drizzleState.accounts[0],
          endorsers: "",
          endorsedAmounts: [],
          status: "initialized",
          modal: false,
          transactionHash: "",
          modalSuccess: true,
          modalPending: true,
          modalBody: "",
          modalTitle: ""
        };

        this.contracts = props.drizzle.contracts;
        this.drizzle = props.drizzle;
        this.web3 = props.drizzle.web3;
    }

    componentDidMount() {
        const { drizzle } = this.props;
        this.loadEndorsers(drizzle);
    }

    async loadEndorsers(drizzle){
        let amounts = [];
        var endorsers = await drizzle.contracts.Debt.methods.getUserEndorsers(this.state.account).call();
        this.setState({ endorsers: endorsers });

        for (let i = 0; i < this.state.endorsers.length; i++) {
            this.contracts.Debt.methods.userToEndorsedStake(this.state.endorsers[i], this.state.account).call({'from': this.state.account})
            .then((result) => {
                amounts.push(this.drizzle.web3.utils.fromWei(result, "ether"));
                this.setState({ endorsedAmounts: amounts });
            });
        }
    }

    createTable = () => {
        let list = [];

        if (this.state.endorsers != null){
            for (let i = 0; i < this.state.endorsers.length; i++) {
              list.push(<tr>
                            <td>
                                {this.state.endorsedAmounts[i]} ETH
                            </td>
                            <td>
                                {this.state.endorsers[i]}
                            </td>
                        </tr>)
            }
        }

        return list;
    }


    render() {
        const endorsers = this.state.endorsers;

        return (
            <>
              <Container className="mt-4">
                <table>
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th><p align="center">Accounts</p></th>
                      </tr>
                    </thead>
                    <tbody>
                        { this.createTable() }
                    </tbody>
                </table>
              </Container>
            </>
        );
    }

}

export default Endorsers;