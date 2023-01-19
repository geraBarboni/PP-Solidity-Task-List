App = {
  contracts: {},
  init: async () => {
    console.log('Loaded');
    await App.loadEthereum();
    await App.loadAccount();
    await App.loadContracts();
    await App.renderTasks();
    App.render();
  },

  loadEthereum: async () => {
    if (window.ethereum) {
      console.log('Ethereum exists');
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('Please install Metamask');
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    App.account = accounts[0];
    console.log(accounts);
  },

  loadContracts: async () => {
    try {
      const res = await fetch('TasksContract.json');
      const tasksContractJSON = await res.json();
      //console.log(tasksContractJSON);
      App.contracts.tasksContract = TruffleContract(tasksContractJSON);
      App.contracts.tasksContract.setProvider(App.web3Provider);
      App.tasksContract = await App.contracts.tasksContract.deployed();
    } catch (error) {
      console.log(error);
    }
  },

  render: () => {
    document.getElementById('account').innerText = App.account;
  },

  renderTasks: async () => {
    const taskCounter = await App.tasksContract.tasksCounter();
    const taskCounterNumber = taskCounter.toNumber();
    let html = '';
    for (let i = 0; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);

      let taskElement = `<div class="card bg-dark rounded-0 my-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>${task[1]}</span>
          <div class="form-check form-switch">
            <input class="form-check-input" data-id="${
              task[0]
            }" type="checkbox" onchange="App.toggleDone(this)" ${
        task[3] === true && 'checked'
      }>
          </div>
        </div>
        <div class="card-body">
          <span>${task[2]}</span>
          <span>${task[3]}</span>
          <p class="text-muted">Task was created ${new Date(
            task[4] * 1000
          ).toLocaleString()}</p>
          </label>
        </div>
      </div>`;
      html += taskElement;
    }

    document.querySelector('#tasksList').innerHTML = html;

    console.log(task);
  },

  createTask: async (title, description) => {
    const result = await App.tasksContract.createTask(title, description, {
      from: App.account,
    });
    console.log(result.logs[0].args);
  },
  toggleDone: async (element) => {
    const taskId = element.dataset.id;
    await App.tasksContract.toggleDone(taskId, {
      from: App.account,
    });
    window.location.reload();
  },
};
