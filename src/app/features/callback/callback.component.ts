import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})

//PROCESA CALLBACK
export class CallbackComponent implements OnInit{

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      console.log('Código recibido:', code);
      
      // Aquí deberías llamar a tu backend para intercambiar el code por un token
    });
  }

}
