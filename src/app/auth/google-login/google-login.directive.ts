import {Directive, ElementRef, inject} from '@angular/core';
import {LoadGoogleApiService} from "./load-google-api.service";

@Directive({
  selector: '[googleLogin]',
  standalone: true
})
export class GoogleLoginDirective {
  #element = inject(ElementRef);
  #loadService = inject(LoadGoogleApiService);

  ngOnInit(): void {
    this.#loadService.setGoogleBtn(this.#element.nativeElement);
  }
}
