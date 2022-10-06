import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  constructor(
    private restApiService: RestApiService
  ) { }

  ngOnInit() {
  }

  body = document.querySelector("body");
   modal = document.querySelector(".modal");
   modalButton = document.querySelector(".modal-button");
   closeButton = document.querySelector(".close-button");
   scrollDown = document.querySelector(".scroll-down");
 isOpened = false;

 openModal = () => {
  this.modal.classList.add("is-open");
  this.body.style.overflow = "hidden";
};

 closeModal = () => {
  this.modal.classList.remove("is-open");
  this.body.style.overflow = "initial";
};

}

